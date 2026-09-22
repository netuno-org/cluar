# Listing (`listing`)

[:arrow_backward: Main](../README.md)

Listing sections and their items are managed in the page editor. They display series of data such as products, services, references, or news. A listing can contain a title, content, image, display order, actions, and related items.

## ReactJS & CSS/LESS

The component that renders listing sections is:

- `website/src/components/Listing`

`website/src/components/Listing/index.jsx` currently implements `Default` and also falls back to `Default` for any other `type` value.

### Item

Items are edited inside a listing section. Each item can contain a title (`title`), content (`content`), image (`image`), order, and URL (`link`); the listing's `type` is passed to its items.

The default item component is:

- `website/src/components/Listing/Default/Item`

The item component uses the listing `type` in its `className`, allowing type-specific LESS styling.

[:arrow_backward: Main](../README.md)
