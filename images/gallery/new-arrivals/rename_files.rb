#!/usr/bin/env ruby

# Ask for prefix
print "Enter prefix: "
prefix = gets.strip

# Get all files in the folder (exclude directories and the script itself)
files = Dir.entries(".").select { |f| File.file?(f) && f != __FILE__ }.sort

if files.empty?
  puts "No files found in this folder."
  exit
end

# Rename files
files.each_with_index do |filename, index|
  number = format("%02d", index + 1)
  ext = File.extname(filename)
  new_name = "#{prefix}-#{number}#{ext}"

  File.rename(filename, new_name)
  puts "Renamed: #{filename} → #{new_name}"
end

puts "✅ Done!"

