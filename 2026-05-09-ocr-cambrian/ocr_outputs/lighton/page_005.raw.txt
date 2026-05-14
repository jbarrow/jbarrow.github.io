show a breakdown of the top 10 most common languages and our form field detection results on them in Table 5.

Unsurprisingly, English-language forms make up the majority of the dataset at 63.6%. However, the other third of forms come from a broad set of languages and language families, including Cantonese, German, Korean, Spanish, French, and others. As part of COMMONFORMS, we release the per-page text, the language, and the classified domains.

### 3.4. Domain Classification

In order to understand the domains from which the forms originate, we use topic modeling [4], both to identify candidate domains and to classify the pages. To train topic models, we repurpose the extracted text from all pages, remove stopwords, and train a topic model using LDA with MALLET [17]. The topic model was trained with 300 topics. We then used GPT-5 to label each topic with a primary domain and a language. Mixed or unclear topics were labeled as Other, and English-language topics were manually verified. The prompt, code, and topic state are all released as artefacts alongside the data.

This process resulted in 14 domains. The results of the domain classification are shown in Table 5. Outside of Other, the five most common domains were (1) Government and Administrative, (2) Commerce and Tax, (3) Engineering, (4) Data and Privacy, and (5) Law and Justice.

## 4. FFDNet

We cast form field detection as an object detection task with three classes (the 4 widget types available in a PDF): Choice Button, which encompasses checkboxes and radio buttons; Text Input; and Signature. We train and release two object detectors based on YOLO11, initialized from scratch: FFDNet-Small, (9 million parameters) and FFDNet-Large, (25 million parameters)².

Both FFDNet models are trained to accept high-resolution inputs, at 1216px. This is substantially higher resolution than traditional object detection tasks, but later experiments and results in Table 4 support the necessity of high-resolution models. We use 1216px as it balances computational efficiency of training and inference against performance; as resolution scales beyond this batch sizes decrease and training times stretch.

The models are trained for 300 epochs with an initial learning rate of 0.001. They are both trained on 4xV100 instances³. FFDNet-L took roughly 5 days to train, and FFDNet-S took roughly 2 days to train. Hyperparameters and input resolution were chosen by training several models

²Due to a processing error, both models are only trained on 350k form pages rather than the full 490k. We are working on retraining the models for release.

³Generously supplied via compute grant from LambdaLabs.

on subsets of COMMONFORMS and seeing how they generalize as model and dataset sizes scale.

## 5. Experiments and Results

We report the performance of FFDNet-S and FFDNet-L in Table 3. All results are reported as $mAP_{50-95}$. FFDNet-L consistently outperforms FFDNet-S across all classes.

However, this performance comes at a cost of memory and computation. On a single 3090Ti, the inference of FFDNet-L takes roughly 16ms per page, while the inference of FFDNet-S takes roughly 5ms. FFDNet-S is better suited for mobile or on-device applications, where memory and compute are at a premium.

### 5.1. Resolution Matters In Form Field Detection

Compared with objects in traditional object detection, many form fields are comparatively fine in an average form. Certain features that signify where a form element should go, such as underlines or colons, are also very fine. A consequence of this is that form field detection is more sensitive to input resolution than traditional object detection.

We examine this by finetuning a series of 6 million parameter FFDNet model on a dataset of 10k pages from COMMONFORMS. We compare 4 resolutions: 640px, 960px, 1216px, and 1536px, and show the results in Table 4. Results are reported on the COMMONFORMS test set, so are directly comparable with all other results reported in the paper.

The results show that resolution is tremendously important. Continuing to 1536px the small models improve in performance across all categories. The differences in performance are stark; there is roughly a 20 point difference from 640px to 1536px. The Choice Button and Signature form fields are most impacted by resolution. This makes intuitive sense for Choice Buttons, which are often very small objects on a form page (radio buttons or checkboxes). Distinguishing a signature from a textbox requires a weak form of optical character recognition (OCR) to determine the proximity of indicator words such as “Signature” or “Unterschrift.”

The FFDNet models are trained at 1216px, a large size for traditional object detection, but empirically a good trade-off between speed and accuracy for form field detection.

### 5.2. FFDNet Outperforms Adobe Acrobat at All Sizes

We qualitatively compare FFDNet and Adobe Acrobat, with results shown in Table 2. Of note, Acrobat does not detect choice buttons at all. Apple Preview also does not detect choice buttons, instead using text inputs in place of all choice buttons. Acrobat suffers from both low recall, miss-