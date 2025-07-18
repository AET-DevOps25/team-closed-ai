# Makefile to generate PNGs from PlantUML files in diagrams/
DIR := ./diagrams

PUML_FILES := $(wildcard $(DIR)/*.puml)
PNG_FILES := $(PUML_FILES:.puml=.png)

all: $(PNG_FILES)

$(DIR)/%.png: $(DIR)/%.puml
	plantuml -tpng $<
