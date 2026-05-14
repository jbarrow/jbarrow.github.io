such as Visual FUDGE [6]. In this work, we tackle form preparation rather than understanding, and cast the task as one of object detection. That is, we do not attempt to extract values, but to predict where on the page the slots for values should be, based on visual information.

**Object Detection in Document Images** Many documents are inherently multimodal, so there are many established lines of research that cast document problems as vision problems, and specifically object detection. Examples include layout detection (DocLayNet [19], PubLayNet [27], Newspaper Navigator [14], PRImA Layout [3]), table detection (TableBank [16]), and math formula detection (FormulaNet [20]). LayoutParser [21] is a suite of tools that provides a unified interface for all of these tasks. Depending on the resolution required, models such as YOLO [11], the Document Image Transformer (DIT) [15], or LayoutLM [25], for multimodality, have been used. COMMONFORMS adopts the same paradigm for detecting form fields. In this work, we treat documents as unimodal images and train object detectors to localize and type form fields. The outputs can be used as a complementary semantic layer in addition to these other models.

**Document Corpora from Common Crawl** ccPDF [22] and FinePDFs [13] curate PDF corpora from Common Crawl. Both datasets target visually and/or topically diverse datasets. Like these efforts, COMMONFORMS is also drawn from Common Crawl. However, in this work, the filtering and preparation is focused on mining well-annotated forms which can be used as training signal for form field detection.

## 3. COMMONFORMS Dataset

There is truth to the adage “quantity has a quality all its own”. The core thesis of this paper is twofold: (1) there are plentiful existing prepared forms in Common Crawl, and (2) those forms are high-quality enough to be used as a training signal. With a few simple filters, we can bootstrap an effective detector without the need for manual annotation. Our goal is to filter to forms that have been well-prepared. We start with a 8 million PDF sample of Common Crawl prepared by the PDF Association [24] and apply a rigorous cleaning process to arrive at the COMMONFORMS dataset. This filtering process is shown in Figure 2, and the limitations of this filtering process are discussed in Section 3.2.

### 3.1. Dataset Preparation and Cleaning

In order to make use of forms from the Web, we build a filtering pipeline that starts with our candidate set and gradually reduces them to a clean set of forms. At every stage,

<table>
  <tr>
    <td>Common Crawl PDFs<br>CC-MAIN-2021-21</td>
  </tr>
  <tr>
    <td>↓<br>n = 7.9MM PDFs</td>
  </tr>
  <tr>
    <td>Filter for PDFs Containing Forms<br>PDF contains AcroForm or XFA</td>
  </tr>
  <tr>
    <td>↓<br>n = 762k PDFs</td>
  </tr>
  <tr>
    <td>Form Consistency Filtering<br>&gt;0 widgets<br>&gt;0 non-button and non-signature widgets<br>remove tiny widgets<br>remove overlapping widgets<br>remove out of bounds widgets</td>
  </tr>
  <tr>
    <td>↓<br>n = 59k PDFs</td>
  </tr>
  <tr>
    <td>CommonForms<br>59k PDFs ; 480k pages</td>
  </tr>
</table>

Figure 2. Filtering pipeline for COMMONFORMS.

the pipeline applies a set of filter functions, shown in Figure 2. We start with 7.9 million PDFs drawn from Common Crawl gathered from the July/August 2021 scrape [24]. The first set of filtering functions is used to find PDFs that contain form objects.

There are two standards for PDF forms: AcroForms and the deprecated XML Forms Architecture (XFA) [9]. We filter only documents that contain form objects from either of these standards, reducing the pool of documents by about 90%, to 762k PDFs.

A PDF having a form object does not mean that it has a well-annotated form, or even a form at all. The next set of filtering functions is used to improve the likelihood that a document in the dataset is well annotated. We remove documents that contain no form fields or that contain only Button form fields. This second round of filtering reduces the set of forms by ≤90% once again, resulting in 59k PDFs.

To improve annotations, we clean the form fields themselves, removing ones that are marked as outside the box of the page, that are too small to resolve, or that have high enough overlap with existing elements as to be considered near duplicates. In total, COMMONFORMS is 480k PDF pages.