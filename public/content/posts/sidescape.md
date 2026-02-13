---
title: sidescape
date: 2026-02-12
slug: sidescape
excerpt: my personal project, an invite-only social map for places and memories. there's the demo ->
---

*an invite-only social map for places and memories*


<img src="/content/img/map-view.png" alt="Map view" style="width:110%; margin-left:-2%"/>



**[sidescape.app](https://sidescape.app)** is a small web mapping system for trusted networks.

it is inspired by collective zines and attempts to create an unofficial cartography space

---


## Why it exists

digital maps tend to flatten cities into efficiency and utility:

routes  
ratings  
ads
visibility metrics

even when a social component is present, it’s usually aggregated, re-summarized by AI, and rewards trending / common-knowledge places

in the face of algo feeds, big data, the attention economy, and overwhelming volumes of digital information, it becomes tempting to return to origins --  
_the word of mouth_

sidescape is an experiment with intimate unofficial cartography: mapping as scrapbooking, archiving, and storytelling

**places appear because they matter to someone within your circle**
and because that someone decided to share them


---

## How it works

- access is invite-only
- visibility scopes are limited to a social graph
	 / personal / shared with friends / shared with friends and their friends
- places added through stories, mementos, and unofficial usecases
- if several people within your network add the same place, their recommendations will be crosslinked 
- personal bookmarks instead of likes
- new recommendations are highlighted on the map, but there is no feed / ranking

---

## Interface fragments

### Map layer
<img src="/content/img/sidescape_map.png" alt="Map view" style="width:110%; margin-left:-2%"/>

*color-coded personal markers and previews in sidebar for places in visibility area*



---

### Place page

<img src="/content/img/sidescape-rec-page-light.png" alt="Map view" style="width:100%; margin-left:-2%"/>

*coordinates paired with narrative, images and authorship*



---

### Interlinked geographies
<img src="/content/img/stacked-recs.png" alt="Map view" style="width:100%; margin-left:-2%"/>

*recommendations are joined, but the voices are disctinct*



---

## Status

just ~launched closed beta: used by a small trusted network
will it thrive? will it be abandoned? we'll see

---

## Tech + Stack
under the hood, sidescape is built as a lightweight but extensible geospatial system:

**Backend**
- django + django REST framework  
- postGIS-enabled postgreSQL  
- token-based auth (magic link flow)

**Frontend**
- react (vite)  
- leaflet for map rendering  
- custom UI components and iconography

**Infra**
- dockerized services 
- object storage for images  
- deployed via cloud VM infrastructure
- ci/cd: github actions

the stack is quite simple: it is an indie project after all

---

\
\
have a nice day -\~=★✶★~.<3.,✶★\
^^^^^^^^^^^^^^^^^^^^^^^^