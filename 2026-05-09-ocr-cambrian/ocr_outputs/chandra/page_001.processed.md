This image shows a blank Aetna form for 'Infertility: Donor, Surrogate, or Gestational Carrier Expense Reimbursement'. It includes sections for 'TO THE PLAN EMPLOYEE', 'TO THE PHYSICIAN OR SUPPLIER', and 'TO THE PHYSICIAN OR SUPPLIER'. The form is a standard document render with various text fields and checkboxes.

**Input**  
(Document Render)

This image shows the same Aetna form as the first, but with colored bounding boxes around various form elements. This represents the output of the FFDNet model, which has detected and labeled individual form fields such as text inputs, checkboxes, and buttons.

**Form Field Detection**  
(FFDNet)

This image shows the Aetna form with the form fields replaced by PDF widgets. The layout is preserved, but the interactive elements like checkboxes and buttons are now rendered as PDF-specific widgets, making the form a single, navigable PDF document.

**Form Preparation**  
(Insert Widgets into PDF)

Figure 1. Overview of form field detection and preparation.

Input, Signature}. This means that, unlike Adobe Acrobat and Apple Preview, FFDNet can predict the location of choice buttons (i.e. checkboxes and radio buttons). As of the time of publication, these tools only predict text form fields.

The FFDNet models are high-resolution (1216px) YOLO11 [11] object detectors. Our ablation results show that high-resolution inputs are crucial to quality; models trained on 10k pages at varying resolutions show a range of roughly 20 mean average precision points.

Our contributions are as follows:

- • we prepare **release COMMONFORMS**, a large, diverse, and high quality dataset for form field detection;
- • we train and **release a family of form field detection models** on COMMONFORMS, FFDNet-Small and FFDNet-Large<sup>1</sup>;
- • we provide an **in depth analysis of COMMONFORMS** to identify the represented languages and domains; and
- • we **compare the FFDNet models against the most popular commercial system**, Adobe Acrobat, and show that they produce substantially higher quality forms.

## 2. Related Work

Machine-learning-based work on document forms can be viewed as two broad categories: form preparation and form understanding. Form preparation is the task of making a form fillable, whether that is detecting widgets or building a semantic model of the form. Form understanding, also

known as key information extraction (KIE), is an information extraction task on filled-out document forms. This paper is an instance of form preparation, which is the smaller of the two subfields.

**Form Preparation and Understanding** Representative work on form preparation includes the line of work on Form2Seq [1, 2] and FormA11y [18]. Form2Seq formalizes a semantic form model, treating it as a joint classification and grouping task. Lower-level elements like widgets and text blocks are first classified into, e.g. *ChoiceButton* or *TextField*, and then grouped into higher-order categories like *ChoiceGroup*. However, it is assumed that the interactive form widgets have already been correctly detected. FormA11y takes a human-in-the-loop approach in which users match labels to widgets to create accessible forms. In contrast to both of these, COMMONFORMS introduces a large-scale dataset and baseline models for automatic detection of the form fields themselves, allowing the end-to-end preparation of a form from a flat document.

Form understanding (KIE) focuses on extracting key-value pairs from completed forms. Common form understanding datasets tend to be small, such as FUNSD [10] (199 labeled forms), and NAF [5] (77 labeled forms). Methodologically, work in the area has employed a diverse body of models, including: purely visual models, such as image segmentation [23]; purely textual models, such as BERT [7]; multimodal models that can model vision, text, and layout information jointly, such as the LayoutLM series [8, 25, 26]; as well as vision and graph-based models

<sup>1</sup> supported by a LambdaLabs compute grant