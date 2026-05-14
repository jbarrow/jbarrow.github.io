![image](image_1.png)

(a) Language distribution of the top 20 languages. One third of the documents are non-English.

![image](image_2.png)

(b) Domain distribution of 14 domains.

Figure 3. Distributions showing the diverse set of languages and domains represented in COMMONFORMS.

We split the data into a training, validation, and test set. We split the train set by document, rather than page, to ensure that similar pages used in training do not leak into the validation and test sets. We build an 8k page validation set and a 25k page test set, reserving the rest of the documents for training.

## 3.2. Annotation Consistency

Forms from the Web are not consistently annotated. Despite extensive filtering that reduces the candidate set of documents by more than 99%, there are still annotation inconsistencies in the prepared forms. These can negatively impact the real-world performance of any models trained on COMMONFORMS. We provide a representative, but not exhaustive, catalog of such inconsistencies in Table 1.

Some of these arise from unconventional or incorrect use of form elements. A common pattern is to see form fields used as headers and footers in a document. The automatically prepared forms can suffer from misleading heuristics, which often look for straight horizontal lines where form fields would likely be placed. This leads to the inclusion of spurious form fields. Text fields can be used in place of signature fields, or signature fields are left blank, intended for a wet signature rather than a digital signature.

However, some of these are related to the semantics of the form itself. “For Official Use Only” sections are sometimes fillable and sometimes not. Similarly, forms with “Circle All that Apply” sections are only occasionally interactive, even if the rest of the form is interactive.

Qualitative results show that despite these inconsistencies, models trained on COMMONFORMS are eminently useful, even on complex forms. These systematic inconsistencies provide an adverse training signal, and are a consequence of using scraped forms rather than manually annotating a dataset. However, they are a trade-off made to scale the dataset to a practical size. We do not attempt to filter any of these annotation inconsistencies and leave that effort for future work.

## 3.3. Language Identification

Although many cues for where a form field should go are visual, such as an underline or empty box, there are many textual cues as well. Cues such as colons before blank spaces, circle or check all that apply sequences, and column headers all use text to indicate the presence of a form field. There is also a difference in form field placement in right-to-left and left-to-right language. As such, models trained to detect form fields benefit from a large number of examples for each language.

We perform language identification on COMMONFORMS by extracting all of the text from every page, and FastText [12] to classify the likeliest language per page. We