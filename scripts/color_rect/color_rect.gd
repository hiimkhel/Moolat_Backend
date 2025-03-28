extends "res://scripts/Content.gd"  # Adjust the path as needed

@onready var color_rect: ColorRect = $MarginContainer/ColorRect


func set_custom_color(new_color: Color) -> void:
	if color_rect:
		color_rect.color = new_color

func play_content() -> void:
	# For example, brighten the color to indicate "active" status.
	color_rect.modulate = Color(1, 1, 1)
	# You can also trigger animations or load quiz data here.
	# For example, call load_content() if not already loaded.

func pause_content() -> void:
	color_rect.modulate = Color(0.5, 0.5, 0.5)
