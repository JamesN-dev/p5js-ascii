# P5.js Waveform to ASCII Art Converter

A simple p5.js project that converts waveform animations to ASCII art. Still very much a work in progress.

# Status
Waveform animations working and being converted to ascii. They seem to only be using half the canvas. Currently workingon fixing position issues. Full inputs work for waveforms 1 and 2. only wave distortion working for waveform 3. 

Pixel Sort only visible with a low pixel density configuration. Trying other sorting algorithms. If you want to see it now, reduce pixel density to 0.5 or lower. 

# Usage
Git clone then open index.html. 

Mess with user input controls. Change parameters in sketch.js. Or add your own waveform animation function (you'll need to add or replace a key action to activate).

# User Input
Currently uses a few minor user inputs from main keyboard only (no numpad yet)

   • 1-3 selects different waveform animations.
   • Up/Down adjusts amplitude.
   • Left/Right adjusts wave distortion.
   • 'P' activates pixel sorting (WIP).
   • +/- zoom in/out of waveform.
   • Hold shift to jump in larger increments.


# Waveforms
   1. Sine (Full Control)
   2. Triangle (Full Control)
   3. Dynamic Wave (Full Control)
   4. .... Coming soon


Some usage of tetoki's p5.asciiart library. 
https://www.tetoki.eu/asciiart/index.html