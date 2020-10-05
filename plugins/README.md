# Customer Project Default - Plugins

Plugins are closely aligned to integrations. They come in a few forms; Bridges, Handlers and Sources.

## Bridges

Bridges are mainly used to retrieve data from applications and display it in user interface forms. A classic example is getting assets matching a specific User Id or Site. Within the plugins directory two components of a bridge are kept; models and adapters.

### Bridge Models

Bridge Models are configs used to define parameters and attributes among other things. Parameters are sent as requests to bridge adapters. Attributes are returned from the adapter in the form of "fields".

### Bridge Adapters

Bridge Adapters are code projects primarily used to execute GET requests to a source system and format data that the Kinetic Platform can leverage.

## Handlers

Handlers are available in the workflow application and can integrate to retrieve, create, update, and/or delete. In fact, handlers are the most flexible integration option for the Kinetic platform.

## Sources

Sources are available with workflow and define what parameters are available to a workflow process from the initial system. In some cases, Sources need to retrieve data from applications to use in parameters.

### Source Adapters

Source Adapters are code projects used for model mapping within the Workflow engine.
