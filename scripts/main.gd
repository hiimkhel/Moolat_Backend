extends Control

@onready var scroll_container: ScrollContainer = $ScrollContainer
@onready var container: VBoxContainer = $ScrollContainer/VBoxContainer
@onready var background1: TextureRect = $Background1
@onready var background2: TextureRect = $Background2
@onready var background3: TextureRect = $Background3

var backgrounds: Array = []
var background_speed: float = 0.5  # Parallax multiplier for background movement

# Array of available video paths for generating new video posts.
var available_video_paths = [
	"res://assets/videos/test1.ogg",
	"res://assets/videos/test2.ogg",
	"res://assets/videos/test3.ogg"
]

var tween: Tween = null
var post_height: float = 0.0
var touch_start_pos: float = 0.0
var touch_end_pos: float = 0.0
var touch_threshold: float = 50.0
var touch_start_scroll: float = 0.0   # Record scroll position at touch start

# Number of posts to initially generate in our pool.
var pool_size: int = 10
# Configuration for feed recycling:
var max_posts: int = 15
var recycle_count: int = 5  # How many posts to remove/add at once

func _ready():
	scroll_container.custom_minimum_size = get_viewport_rect().size

	backgrounds = [background1, background2, background3]
	for bg in backgrounds:
		bg.custom_minimum_size = get_viewport_rect().size

	# Generate an initial pool of content nodes.
	generate_initial_pool(pool_size)
	
	await get_tree().process_frame
	await get_tree().process_frame
	
	if container.get_child_count() > 0:
		post_height = container.get_child(0).size.y
	scroll_container.set_v_scroll(0.0)
	
	# Increase delay to 0.3 seconds (or more) to allow deferred calls to run.
	await get_tree().create_timer(0.3).timeout
	check_contents_visibility()

func generate_initial_pool(count: int) -> void:
	# Generate a fixed number of nodes. For each node, randomly choose video or game.
	for i in range(count):
		var instance
		if randf() < 0.5:
			instance = load("res://scenes/video/VideoPost.tscn").instantiate()
			# Defer setting the video path.
			instance.call_deferred("set_video_path", available_video_paths[randi() % available_video_paths.size()])
		else:
			instance = load("res://scenes/colorrect/color_rect.tscn").instantiate()
			instance.call_deferred("set_custom_color", Color(randf(), randf(), randf()))
		instance.custom_minimum_size = scroll_container.custom_minimum_size
		container.add_child(instance)

func _process(delta: float) -> void:
	_update_background_positions()
	check_contents_visibility()
	update_feed_window()

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch and event.pressed:
		touch_start_pos = event.position.y
		touch_start_scroll = scroll_container.get_v_scroll()
	elif event is InputEventScreenDrag:
		var delta_scroll = -event.relative.y
		scroll_container.set_v_scroll(scroll_container.get_v_scroll() + delta_scroll)
	elif event is InputEventScreenTouch and not event.pressed:
		touch_end_pos = event.position.y
		handle_touch_scroll()

func handle_touch_scroll() -> void:
	var separation = container.get_theme_constant("separation")
	var snap_height = post_height + separation
	var original_index = floor(touch_start_scroll / snap_height)
	var delta = touch_start_pos - touch_end_pos
	var target_index = original_index
	if abs(delta) > touch_threshold:
		if delta > 0:
			target_index = original_index + 1
		else:
			target_index = original_index - 1
	else:
		target_index = original_index
	target_index = clamp(target_index, 0, container.get_child_count() - 1)
	var target_scroll = target_index * snap_height
	animate_scroll(target_scroll)

func animate_scroll(target: float) -> void:
	if tween:
		tween.kill()
	tween = create_tween()
	tween.tween_property(scroll_container.get_v_scroll_bar(), "value", target, 0.3).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	await tween.finished
	check_contents_visibility()

func check_contents_visibility() -> void:
	var scroll_pos = scroll_container.get_v_scroll()
	var viewport_center = scroll_pos + scroll_container.size.y / 2
	for i in range(container.get_child_count()):
		var post = container.get_child(i)
		var post_center = post.position.y + post.size.y / 2
		if abs(post_center - viewport_center) < post_height / 2:
			if post.has_method("load_content"):
				post.load_content()
			if post.has_method("play_content"):
				post.play_content()
		else:
			if post.has_method("pause_content"):
				post.pause_content()
			if post.has_method("unload_content"):
				post.unload_content()

func _update_background_positions() -> void:
	var vp_height = get_viewport_rect().size.y
	var total_offset = -scroll_container.get_v_scroll() * background_speed
	var offset = fmod(total_offset, vp_height)
	if offset < 0:
		offset += vp_height
	backgrounds[0].position.y = offset - vp_height  # One above the viewport
	backgrounds[1].position.y = offset               # Centered in the viewport
	backgrounds[2].position.y = offset + vp_height     # One below the viewport

# Recycles posts when there are too many: removes posts that have scrolled far above and appends new posts at the bottom.
func update_feed_window() -> void:
	if container.get_child_count() > max_posts:
		var removed_height: float = 0.0
		var buffer = post_height * 0.5
		var count = recycle_count
		while count > 0 and container.get_child_count() > 0:
			var node = container.get_child(0)
			if node.position.y + node.size.y < scroll_container.get_v_scroll() - buffer:
				removed_height += node.size.y + container.get_theme_constant("separation")
				container.remove_child(node)
				node.queue_free()
				count -= 1
			else:
				break
		if removed_height > 0:
			scroll_container.set_v_scroll(scroll_container.get_v_scroll() - removed_height)
			for i in range(recycle_count):
				var instance
				if randf() < 0.5:
					instance = load("res://scenes/video/VideoPost.tscn").instantiate()
					var path = available_video_paths[randi() % available_video_paths.size()]
					instance.call_deferred("set_video_path", path)
				else:
					instance = load("res://scenes/colorrect/color_rect.tscn").instantiate()
					instance.call_deferred("set_custom_color", Color(randf(), randf(), randf()))
				instance.custom_minimum_size = scroll_container.custom_minimum_size
				var last = container.get_child(container.get_child_count() - 1)
				instance.position.y = last.position.y + last.size.y + container.get_theme_constant("separation")
				container.add_child(instance)
