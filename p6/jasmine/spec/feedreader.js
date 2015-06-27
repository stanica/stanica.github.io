/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
	/* This is our first test suite - a test suite just contains
	* a related set of tests. This suite is all about the RSS
	* feeds definitions, the allFeeds variable in our application.
	*/
	describe('RSS Feeds', function() {
		/* This is our first test - it tests to make sure that the
		* allFeeds variable has been defined and that it is not
		* empty.
		*/
		it('are defined', function() {
			expect(allFeeds).toBeDefined();
			expect(allFeeds.length).not.toBe(0);
		});

		/* Test that loops through each feed in the allFeeds object and ensures it has a URL defined
		* and that the URL is not empty.
		*/
		it('have links', function(){
			allFeeds.forEach(function(feed){
				expect(feed.url).toBeDefined();
				expect(feed.url.length).not.toBe(0);
			});
		});

		/* Test that loops through each feed in the allFeeds object and ensures it has a name defined
		* and that the name is not empty.
		*/
		it('have names', function(){
			allFeeds.forEach(function(feed){
				expect(feed.name).toBeDefined();
				expect(feed.name.length).not.toBe(0);
			});
		});

		/* Test that adds additional link to list of feeds
		*/
		it('can be increased', function() {
			var url = 'http://www.reddit.com/r/programming/.rss';
			var name = 'Reddit/Programming';
			addFeed(name, url);
			expect(allFeeds[allFeeds.length-1].name).toBe(name) &&
			expect(allFeeds[allFeeds.length-1].url).toBe(url);
		});
	});

	describe('The Menu', function() {

		/* Test that ensures the menu element is  hidden by default.
		*/
		it('is hidden by default', function() {
			expect($('body').attr('class')).toBeDefined();
			expect($('body').hasClass('menu-hidden')).toBe(true);
		});

		/* test that ensures the menu changes visibility when the menu icon is clicked.
		*/
		it('changes visibility when clicked', function() {
			$('.menu-icon-link').click();
			expect($('body').hasClass('menu-hidden')).toBe(false);
			$('.menu-icon-link').click();
			expect($('body').hasClass('menu-hidden')).toBe(true);
		});
	});

	describe('Initial Entries', function() {

		/* Test that ensures when the loadFeed function is called and completes its work, there is at least
		* a single .entry element within the .feed container.
		*/
		beforeEach(function(done) {
			loadFeed(0, done);
		});

		it('contain at least one entry', function() {
			expect($('.feed')[0].children.length).toBeGreaterThan(0);
		});
	});

	describe('New Feed Selection', function() {
		var content = '';
		var	content2 = '';

		beforeEach(function(done) {
			$('.feed').empty();
			loadFeed(0, function() {
				content = $('.feed').find("h2")[0].innerText;
				loadFeed(1, function(){
					content2 = $('.feed').find("h2")[0].innerText;
					done();
				});
			});
		});

		/* Test that ensures when a new feed is loaded by the loadFeed function that the content actually changes.
		*/
		it('changes content', function() {
			expect(content).not.toBe(content2);
		});
	});

	/* Test suite to test header text of page */
	describe('Header Title', function() {

		/* Test to ensure header text changes when menu item is clicked */
		it('changes to reflect menu selection', function() {
			var original = $('.header-text');
			$('.feed-list').find('a')[3].click();
			var updated = $('.header-text');
			expect(original).not.toBe(updated);
		});
	});
}());