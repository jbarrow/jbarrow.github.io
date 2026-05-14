# COMMONFORMS: A Large, Diverse Dataset for Form Field Detection

Joe Barrow

Independent Researcher

joseph.d.barrow@gmail.com

## Abstract

*This paper introduces CommonForms, a web-scale dataset for form field detection. It casts the problem of form field detection as object detection: given an image of a page, predict the location and type (Text Input, Choice Button, Signature) of form fields. The dataset is constructed by filtering Common Crawl to find PDFs that have fillable elements. Starting with 8 million documents, the filtering process is used to arrive at a final dataset of roughly 55k documents that have more than 450k pages. Analysis shows that the dataset contains a diverse mixture of languages and domains; one third of the pages are non-English, and among the 14 classified domains, no domain makes up more than 25% of the dataset.*

*In addition, this paper presents a family of form field detectors, FFDNet-Small and FFDNet-Large, which attain a very high average precision on the CommonForms test set. Each model cost less than \$500 to train. Ablation results show that high-resolution inputs are crucial for high-quality form field detection, and that the cleaning process improves data efficiency over using all PDFs that have fillable fields in Common Crawl. A qualitative analysis shows that they outperform a popular and commercially available PDF reader that can prepare forms. Unlike the most popular commercially available solutions, FFDNet can predict checkboxes in addition to text and signature fields. This is, to our knowledge, the first large-scale dataset released for form field detection, as well as the first open-source models. The dataset, models, and code will be released at <https://github.com/jbarrow/commonforms>.*

## 1. Introduction

Despite decades of digitalization, a large volume of real-world transactions still center around paper forms: insurance claims, municipal paperwork, school permission slips, and many, many others. These documents are often distributed as scans or non-fillable (“flat”) PDFs, and require either printing, tedious software workarounds, or turning to a proprietary solution like Adobe Acrobat or Apple Preview.

In order to be digitally filled, a flat form must be prepared by having interactive form fields inserted. Although proprietary solutions may employ machine learning to prepare forms, there is not yet a high-quality open-source machine learning-based system that can automatically and reliably prepare fillable forms.

Converting a flat PDF to an *accessible* form — one that can be understood by a screen reader, or filled automatically — typically requires two steps:

1. 1. **form field detection**: detecting the locations and types (e.g. text or checkbox) of fillable elements; and
2. 2. **form enrichment**: grouping the fillable elements and their labels based on the semantics of the form.

Previous work has primarily focused on the second [1, 2]. In this work, we tackle the first problem by detecting where the fillable elements should go visually in a PDF. To this end, we construct and release both a large-scale dataset, COMMONFORMS, consisting of more than 480k pages from more than 59k document forms.

We also train and release a family of form field detection models trained on this dataset, FFDNet-Small and FFDNet-Large. Training each of these models **costs roughly \$500 of compute or less**, and yet these models are capable of high-quality form field detection. They achieve a high average precision of more than 80 on the COMMONFORMS test set. We perform a qualitative analysis of these models against Adobe Acrobat and show that FFDNet has better recall and precision than Acrobat.

COMMONFORMS is drawn from a large collection of interactive PDF forms scraped from the Internet. The core insight of this paper is that “quantity has a quality all its own,” and that we can leverage existing fillable forms as a training signal. We use Common Crawl as a wellspring of PDFs and apply a rigorous cleaning process. This cleaning process results in improved data efficiency compared to using every PDF with a form field.

To train the FFDNet family of models, we cast the problem of form field detection as a pure object detection problem. Given a page image, the goal is to predict the location and types of each form element. The types are drawn from the following set: {Choice Button, Text