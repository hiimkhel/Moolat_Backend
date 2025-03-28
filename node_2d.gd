extends Node2D 

@export var next_scene : PackedScene
@export var login_screen : PackedScene

func _ready():
	$Timer.start()  # Start the timer when the scene loads

func _on_timer_timeout() -> void:
	if Global.logged_in:
		get_tree().change_scene_to_packed(next_scene)
	else:
		get_tree().change_scene_to_packed(login_screen)
