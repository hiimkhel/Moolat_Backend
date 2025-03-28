extends Control

@export var active_threshold: float = 50.0  # How close to center the content must be to be "active"

func _process(delta: float) -> void:
	# Assume the hierarchy is: ScrollContainer > VBoxContainer > (this content)
	var scroll_container = get_parent().get_parent()
	if scroll_container == null:
		return
	var viewport_center = scroll_container.get_global_position().y + scroll_container.size.y / 2
	var my_center = get_global_position().y + size.y / 2
	if abs(my_center - viewport_center) < active_threshold:
		play_content()
	else:
		pause_content()

# These are meant to be overridden by children.
func play_content() -> void:
	pass

func pause_content() -> void:
	pass

func load_content() -> void:
	pass
