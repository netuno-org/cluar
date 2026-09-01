# Content (`content`)

[:arrow_backward: Main](../README.md)

Content sections are managed in the page editor. They can contain a title, content, image, display order, actions, and image presentation settings.

## ReactJS & CSS/LESS

The component that renders content sections is:

- `website/src/components/Content`

`website/src/components/Content/index.jsx` dispatches the built-in `TextContent`, `ImageLeft`, `ImageRight`, `ImageTop`, `ImageBottom`, and `ImageContent` values to their matching components; other `type` values use `Default`. Each type component defines the `className` values used by its own LESS styles.

[:arrow_backward: Main](../README.md)
