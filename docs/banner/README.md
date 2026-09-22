# Banner (`banner`)

[:arrow_backward: Main](../README.md)

Banner sections are managed in the page editor. They provide the main visual highlights of website pages and can contain a title, content, image, display order, actions, and image-focus positions.

## ReactJS & CSS/LESS

The component that renders banner sections is:

- `website/src/components/Banner`

`website/src/components/Banner/index.jsx` dispatches the built-in `Default`, `Secondary`, and `DefaultSubBanner` types to their matching component directories; an unknown `type` falls back to `Default`. Each type component defines the `className` values used by its own LESS styles.

### Position (`position_x` and `position_y`)

The X and Y positions adjust the focus of the background image at different resolutions. Values are CSS background-position values and are normally percentages.

For example, `50%` for both fields keeps the image centered.

[:arrow_backward: Main](../README.md)
