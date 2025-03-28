extends Label

var original_text: String

func _ready():
	original_text = text

func _get_drag_data(at_position):
	var preview_label = Label.new()
	preview_label.text = text
	preview_label.add_theme_font_override("font", get_theme_font("font"))
	preview_label.add_theme_font_size_override("font_size", get_theme_font_size("font_size"))
	set_drag_preview(preview_label)
	return text

func _can_drop_data(at_position, data):
	return data is String

func _drop_data(at_position, data):
	text = data
