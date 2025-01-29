# agent-orange

Agent Orange is a chrome extension for changing Donald j. Trump his name to any word you please. It can also optionally try to change photo's of him into pictures of kittens. Because browsing online news outlets will be something you can handle.

## How to build and install

1. Clone or download this repo
2. `npm install` 
3. `npm run build`
4. Go to your chrome extension page [chrome://extensions](chrome://extensions)
5. Click "Load unpacked extensions"
6. navigate to the 'dist' folder
7. giddy up!

optional:

for analytics through google's measurements api add a `.env` or `.env.local` to the root directory with the following key value pairs:

```javascript
VITE_MEASUREMENT_ID="G-your_m_key"
VITE_API_SECRET="your_api_key"
```

## How to update

1. Download
2. Replace files
3. Go to chrome://extensions
4. Hit ctrl+R

## Change options
When you install the extension an icon will appear next to the Chrome address bar, click on it and a popup window appears.
Here you can do the following:
- Change the word your replacing his name with.
- Select if the extension will try to replace photo's
- Pause or Resume the extension

## Software used
Software this greatly benefits from:

- Cash by Fabio Spampinato - https://github.com/fabiospampinato/cash
- Bootstrap - http://getbootstrap.com/
- FindAndReplaceDOMText by James Padolsey - https://github.com/padolsey/findAndReplaceDOMText
- Placecats placeholders https://placecats.com/
