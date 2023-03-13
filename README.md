## Installation:

**IRI Widget** - _used to popup the axiom protect 2.0 at the current page itself._

Use this script tag to get access to the widget.

**_`<script src="https://cdn.jsdelivr.net/npm/iri-widget@1.0.2/dist/index.min.js"></script>`_**

## Implementation:

**Steps:-**

1. Create or open an html file.

2. Add a button with the id **`useiri`**. It is used to call the axiom by on click event.

```html
<button id="useiri">Open</button>
```

3. Add a div tag with the id **`iri-script-widget`** at the last or beginning of the body tag. It is used to display the iri module with the help of this id.

```html
<div id="iri-script-widget"></div>
```

4. Add a Script tag to the head tag or body tag. And use the latest version.

```html
<script src="https://cdn.jsdelivr.net/npm/iri-widget@1.0.2/dist/index.min.js"></script>
```

5. Next, add the script tag at a necessary place. But add below the widget script.

```html
<script>
	const config = {
		baseurl: string,
		showPopup: boolean,
		userId: string,
		linkForTC: string,
		onResponse: function (data) {},
		onError: function (data) {},
		onPopupClose: function (data) {}
	};

	var container = document.getElementById('useiri');

	container.addEventListener('click', function () {
		iri.IRIWidget(config);
	});
</script>
```

_Here, the config variable is used to pass the data. And the container variable is to get the dom element of the id **`useiri`** button and added to the event listener. It checks if the button is clicked and sends the config object data to the iri.
**`iri.IRIWidget(config)`**_

**Note:-**

- _**`baseurl`** should pass as a string value. It is used as the base URL for API calls._
- _**`showPopup`** is used to pass a boolean value ( **`true`** or **`false`** ). To toggle the widget popup._
- _**`userId`** should pass as a string value. It is used to get the jwt token from the operator mail._
- _**`linkForTC`** should pass as a string value. It is used to redirect the Terms and condition page or any URL or **`#`** ._
- _**`onResponse`** is a callback function. It is getting called when the API gives a successful response. Return data is an object with its API endpoint and result._
- _**`onError`** is a callback function. It is getting called when the API gives an error message. Return data is an object with its API endpoint and result._
- _**`onPopupClose`** is a callback function. It is getting called when the popup gets closed or session gets expired. Return data is an object with its action and result._
