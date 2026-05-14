![Bar chart titled 'Top Languages in CommonForms' showing the percentage of pages for various languages. English is the most frequent at 63.6%, followed by Cantonese at 12.6%, German at 6.8%, and others down to Tibetan at 0.2%.](5f3af173e00c5f71804b008c59cf7fa1_1_img.webp)

<table border="1">
<caption>Top Languages in CommonForms</caption>
<thead>
<tr>
<th>Language</th>
<th>Percent of Pages (%)</th>
</tr>
</thead>
<tbody>
<tr><td>English</td><td>63.6%</td></tr>
<tr><td>Cantonese</td><td>12.6%</td></tr>
<tr><td>German</td><td>6.8%</td></tr>
<tr><td>Korean</td><td>2.6%</td></tr>
<tr><td>Spanish</td><td>2.6%</td></tr>
<tr><td>French</td><td>2.2%</td></tr>
<tr><td>Russian</td><td>1.0%</td></tr>
<tr><td>Italian</td><td>0.9%</td></tr>
<tr><td>Portuguese</td><td>0.8%</td></tr>
<tr><td>Occitan</td><td>0.7%</td></tr>
<tr><td>Dutch</td><td>0.6%</td></tr>
<tr><td>Danish</td><td>0.6%</td></tr>
<tr><td>Greek</td><td>0.6%</td></tr>
<tr><td>Swedish</td><td>0.5%</td></tr>
<tr><td>Catalan</td><td>0.5%</td></tr>
<tr><td>Hungarian</td><td>0.4%</td></tr>
<tr><td>Galician</td><td>0.3%</td></tr>
<tr><td>Basque</td><td>0.2%</td></tr>
<tr><td>Czech</td><td>0.2%</td></tr>
<tr><td>Tibetan</td><td>0.2%</td></tr>
</tbody>
</table>

(a) Language distribution of the top 20 languages. One third of the documents are non-English.

![Bar chart titled 'Domain Distribution of CommonForms' showing the percentage of pages for various domains. 'Other' is the largest at 22.1%, followed by Government at 9.9%, Administrative at 7.4%, Engineering at 7.1%, Finance & Tax at 6.5%, Personal Data at 6.1%, Law & Justice at 6.0%, Health at 5.8%, Education at 5.7%, Environment at 5.1%, Business at 4.5%, Transportation at 4.0%, Culture & Religion at 3.7%, Real Estate at 2.4%, Technology at 2.1%, Sports & Recreation at 1.1%, and Telecommunication at 0.5%.](5f3af173e00c5f71804b008c59cf7fa1_3_img.webp)

<table border="1">
<caption>Domain Distribution of CommonForms</caption>
<thead>
<tr>
<th>Domain</th>
<th>Percent of Pages (%)</th>
</tr>
</thead>
<tbody>
<tr><td>Other</td><td>22.1%</td></tr>
<tr><td>Government</td><td>9.9%</td></tr>
<tr><td>Administrative</td><td>7.4%</td></tr>
<tr><td>Engineering</td><td>7.1%</td></tr>
<tr><td>Finance &amp; Tax</td><td>6.5%</td></tr>
<tr><td>Personal Data</td><td>6.1%</td></tr>
<tr><td>Law &amp; Justice</td><td>6.0%</td></tr>
<tr><td>Health</td><td>5.8%</td></tr>
<tr><td>Education</td><td>5.7%</td></tr>
<tr><td>Environment</td><td>5.1%</td></tr>
<tr><td>Business</td><td>4.5%</td></tr>
<tr><td>Transportation</td><td>4.0%</td></tr>
<tr><td>Culture &amp; Religion</td><td>3.7%</td></tr>
<tr><td>Real Estate</td><td>2.4%</td></tr>
<tr><td>Technology</td><td>2.1%</td></tr>
<tr><td>Sports &amp; Recreation</td><td>1.1%</td></tr>
<tr><td>Telecommunication</td><td>0.5%</td></tr>
</tbody>
</table>

(b) Domain distribution of 14 domains.

Figure 3. Distributions showing the diverse set of languages and domains represented in COMMONFORMS.

We split the data into a training, validation, and test set. We split the train set by document, rather than page, to ensure that similar pages used in training do not leak into the validation and test sets. We build an 8k page validation set and a 25k page test set, reserving the rest of the documents for training.

### 3.2. Annotation Consistency

Forms from the Web are not consistently annotated. Despite extensive filtering that reduces the candidate set of documents by more than 99%, there are still annotation inconsistencies in the prepared forms. These can negatively impact the real-world performance of any models trained on COMMONFORMS. We provide a representative, but not exhaustive, catalog of such inconsistencies in Table 1.

Some of these arise from unconventional or incorrect use of form elements. A common pattern is to see form fields used as headers and footers in a document. The automatically prepared forms can suffer from misleading heuristics, which often look for straight horizontal lines where form fields would likely be placed. This leads to the inclusion of spurious form fields. Text fields can be used in place of signature fields, or signature fields are left blank, intended for a wet signature rather than a digital signature.

However, some of these are related to the semantics of the form itself. “For Official Use Only” sections are some-

times fillable and sometimes not. Similarly, forms with “Circle All that Apply” sections are only occasionally interactive, even if the rest of the form is interactive.

Qualitative results show that despite these inconsistencies, models trained on COMMONFORMS are eminently useful, even on complex forms. These systematic inconsistencies provide an adverse training signal, and are a consequence of using scraped forms rather than manually annotating a dataset. However, they are a trade-off made to scale the dataset to a practical size. We do not attempt to filter any of these annotation inconsistencies and leave that effort for future work.

### 3.3. Language Identification

Although many cues for where a form field should go are visual, such as an underline or empty box, there are many textual cues as well. Cues such as colons before blank spaces, circle or check all that apply sequences, and column headers all use text to indicate the presence of a form field. There is also a difference in form field placement in right-to-left and left-to-right language. As such, models trained to detect form fields benefit from a large number of examples for each language.

We perform language identification on COMMONFORMS by extracting all of the text from every page, and FastText [12] to classify the likeliest language per page. We