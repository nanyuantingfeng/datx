---
id: jsonapi-model
title: Model
---

The JSON API model enhances the `datx` model with the following properties and methods:

- `static endpoint: string|(() => string)` - The endpoint name in case it differs from the model type
- `save(options?: IRequestOptions): Promise<Response>;` - A method to save the model. It will either create a model or update it, depending on the current model state.
- `destroy(options?: IRequestOptions): Promise<void>;` - A method to remove the model from the server.
