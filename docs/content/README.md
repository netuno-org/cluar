
# Contents (`content`)

[:arrow_backward: Main](../README.md)

In the back office menu, under `Content`, the contents of the website pages are managed.

The content can contain Title, Description, Image and Order (ordering).

## ReactJS & CSS/LESS

The ReactJS component that manages all Content on the website is located at:

- `website/src/components/Content`

The component receives several properties such as title (`title`), content (`content`), image (`image`), among others.

> Before carrying out the customization, analyze the properties and the CSS/LESS code associated with the component.

### Type (`type`)

The contents must contain an associated type.

The type can be customized in the form `Content > Type`, where the code field is the value that is used by the ReactJS component in the `type` property.

Then the `type` property received in the ReactJS component `website/src/components/Content` defines the type of content that will be processed.

The `type` property can be used in conditions to customize the HTML structure that will be rendered in the component rendering.
 
The `type` should also be added to the `className` properties of HTML tags generated by the component, to maintain the standard and organization of names, and also make it easier to customize their appearance in the CSS/LESS code.

[:arrow_backward: Main](../README.md)
