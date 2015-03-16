# Optmizations for P4

## Portfolio page
1. I compressed images using a factor of 65. Personally I think the PageSpeed Insight tool is too aggressive with wanting compressed photos. Compression on small icon-sized images results in many visual artifacts.
2. I included the Open Sans font using JavaScript instead of the default stylesheet link.
3. I minified the CSS and included it in index.html. I wasn't too happy with the fact that the PageSpeed Insight tool needed this. Form and content should be separate by principle.
4. I made the analytics and stats scripts get called asynchronously.

Final score: 94 mobile, 96 desktop as I could not leverage browser caching due to hosting the website on github.

## Pizza.html
### changePizzaSizes()
1. Used getElementsByClassName instead of querySelectorAll as it's faster [1]
2. Cached length of container
3. Cached difference calculation
4. Cached new width calculation

### updatePositions
1. Cached scrollTop value [2]



[1] http://ryanmorr.com/abstract-away-the-performance-faults-of-queryselectorall/

[2] https://www.igvita.com/slides/2012/devtools-tips-and-tricks/jank-demo.html

# Install instructions
Copy the root folder of stanica.github.io to your public_html folder to view all my current projects. A live version can be found at http://stanica.github.io/p4/index.html
