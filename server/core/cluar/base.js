const cluar = { page: {}, custom: {} }

cluar.base = ()=> {
  if (_env.is("dev")) {
    return "website/public"
  } else {
    return "website/dist"
  }
}
