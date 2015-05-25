Instructions
=
To run, open index.html. Note that for the Uber API to work you'll need to view the project hosted on my github at https://stanica.github.io/p5/index.html as I can only allow one domain for CORS. 

Features
=
1. Dynamic list of markers grows as markers are added to map.
2. List of markers is scrollable if more markers are added than would fit on the screen.
3. Clicking on an item in the markers list selects that marker on the map.
4. Clicking the "x" on a list item deletes the item from the list and the map.
5. Selected markers are shown in green.
6. Content windows contain Google street view image of location along with current weather information pulled from the World Weather Online api and an estimate of the time needed to call an UberX car via the Uber api.  


Code used for filtering array:
http://stackoverflow.com/questions/23397975/knockout-live-search
