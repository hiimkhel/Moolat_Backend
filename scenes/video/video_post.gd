extends Control

@onready var video_player = $MarginContainer/VideoStreamPlayer
@export var video_path: String = ""
var content_loaded: bool = false

func set_video_path(path: String) -> void:
	video_path = path

func load_content() -> void:
	if not content_loaded and video_player and video_path != "":
		var video_stream = VideoStreamTheora.new()
		video_player.stream = video_stream
		video_stream.file = video_path  # Assign the file path as a string
		content_loaded = true
	elif video_path == "":
		# Safeguard: if video_path is empty, do nothing (or print a warning)
		print("Warning: video_path is empty; skipping load_content()")

func unload_content() -> void:
	if content_loaded and video_player:
		video_player.stop()
		video_player.stream = null
		content_loaded = false

func play_content() -> void:
	if not content_loaded:
		load_content()
	if video_player:
		video_player.paused = false
		if not video_player.is_playing():
			video_player.play()

func pause_content() -> void:
	if video_player:
		video_player.paused = true
