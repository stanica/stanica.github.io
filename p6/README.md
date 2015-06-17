# Project Overview

This project is a web-based application that reads RSS feeds. 

#Default Tests

The following default tests are implemented:

1. Test that loops through each feed in the allFeeds object and ensures it has a URL defined and that the URL is not empty.
2. Test that loops through each feed in the allFeeds object and ensures it has a name defined and that the name is not empty.
3. Test that ensures the menu element is hidden by default.
4. Test that ensures the menu changes visibility when the menu icon is clicked.
5. Test that ensures when the loadFeed function is called and completes its work, there is at least a single .entry element within the .feed container.
6. Test that ensures when a new feed is loaded by the loadFeed function that the content actually changes.

#Extra Tests
7. Test that ensure when a new feed is loaded the header text changes.