###
# Copyright 2012 Shawn Krisman
# This file is part of Nodelings.
#
# Nodelings is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Nodelings is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
#
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Nodelings.  If not, see <http://www.gnu.org/licenses/>.
###

fs = require('fs')

class FileUtils
  ###
  # Finds all the files that match a regex.
  #
  # @param {string} path
  # @param {regex} regex
  # @returns {Array.<Array.<string>>} matches for all files that match the regex
  ###
  @matches: (path, regex) ->
    matchedFiles = []
    files = fs.readdirSync(path)

    for file in files
      match = file.match(regex)
      if match
        matchedFiles.push(match)

    return matchedFiles

exports.FileUtils = FileUtils