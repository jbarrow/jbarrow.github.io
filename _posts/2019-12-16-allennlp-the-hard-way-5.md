---
layout: post
title: Part 5 - Building a Predictor
tags: allennlp
blurb: (In Progress) Exploring AllenNLP Predictors for using your trained models.
letter: 5
---

In this section we'll learn about how to build a `Predictor`, a bit of AllenNLP code which allows us to explore model outputs and apply our pretrained models to a new dataset.

## 5.1 The Point of Predictors

Predictors have three primary functions in AllenNLP:

  1. Exploring model predictions
  2. Applying pretrained models to a new dataset
  3. Deploying a pretrained model in production

We're going to look at the first two of these, but if you're interested in using AllenNLP to serve models in production, you should definitely take a look at [`allennlp serve`](https://allenai.github.io/allennlp-docs/api/allennlp.commands.serve.html).

## 5.2 A Basic Predictor
