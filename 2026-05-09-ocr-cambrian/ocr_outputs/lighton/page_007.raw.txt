Table 3. Object detection performance (AP; higher is better) by widget type.

<table>
  <thead>
    <tr>
      <th>Model</th>
      <th>Text AP (↑)</th>
      <th>Choice AP (↑)</th>
      <th>Sig. AP (↑)</th>
      <th>All AP (↑)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>FFDNet-S (1216px)</td>
      <td>61.5</td>
      <td>71.3</td>
      <td>84.2</td>
      <td>72.3</td>
    </tr>
    <tr>
      <td>FFDNet-L (1216px)</td>
      <td>71.4</td>
      <td>78.1</td>
      <td>93.5</td>
      <td>81.0</td>
    </tr>
  </tbody>
</table>

Table 4. Object detection performance

<table>
  <thead>
    <tr>
      <th>Resolution</th>
      <th>Text AP (↑)</th>
      <th>Choice AP (↑)</th>
      <th>Sig. AP (↑)</th>
      <th>All AP (↑)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>640px</td>
      <td>49.2</td>
      <td>52.2</td>
      <td>26.7</td>
      <td>42.7</td>
    </tr>
    <tr>
      <td>960px</td>
      <td>52.3</td>
      <td>62.0</td>
      <td>44.0</td>
      <td>52.8</td>
    </tr>
    <tr>
      <td>1216px</td>
      <td>53.0</td>
      <td>65.8</td>
      <td>54.9</td>
      <td>57.9</td>
    </tr>
    <tr>
      <td>1536px</td>
      <td>53.2</td>
      <td>67.9</td>
      <td>65.3</td>
      <td>62.1</td>
    </tr>
  </tbody>
</table>

ing tens of form fields per form page, and low precision, table elements and separator lines for text fields.

## 5.3. FFDNet is Robust Across Languages/Domains

Building on the language and domain analysis from Section 3, we can compare the performance per-language and per-domain.

Both sizes of FFDNet have similar performance across 9 of the 10 most common languages, though they suffer from degraded performance in Russian. FFDNet-S has a higher variance across languages, as the network is likely not equipped with enough parameters to faithfully capture textual signals across languages. Similarly, both models perform consistently across domains, with FFDNet-S having a slightly higher variance than FFDNet-L.

## 5.4. Filtering Improves Data Efficiency

COMMONFORMS employs an aggressive filtering strategy to maximize the likelihood that pages in the dataset are well-prepared forms. However, this is done at the cost of potentially more usable data ending up in the training set. To evaluate this trade-off, we train a 6 million parameter FFDNet model on 10k form pages drawn from the filtered set of forms (59k documents), and the same model on 10k form pages drawn from the set of all forms (760k documents). The $mAP_{50-95}$ when measured on the test set is roughly 4 points higher (57.9 v. 53.6).

## 6. Conclusions and Future Work

In this paper we build and release COMMONFORMS, a dataset of 490k diverse form images filtered from PDFs in Common Crawl. We show that the filtering process improves the data efficiency versus the strategy of keeping

Table 5. Subcategory results.

<table>
  <thead>
    <tr>
      <th>Subcategory</th>
      <th>% Pages</th>
      <th>FFNet-S AP (↑)</th>
      <th>FFNet-L AP (↑)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>All</td>
      <td>100</td>
      <td>72.3</td>
      <td>81.0</td>
    </tr>
    <tr>
      <td>Language</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>English</td>
      <td>63.6</td>
      <td>72.4</td>
      <td>80.6</td>
    </tr>
    <tr>
      <td>Cantonese</td>
      <td>12.6</td>
      <td>73.4</td>
      <td>80.4</td>
    </tr>
    <tr>
      <td>German</td>
      <td>6.8</td>
      <td>68.6</td>
      <td>80.7</td>
    </tr>
    <tr>
      <td>Korean</td>
      <td>2.6</td>
      <td>75.6</td>
      <td>89.3</td>
    </tr>
    <tr>
      <td>Spanish</td>
      <td>2.6</td>
      <td>62.5</td>
      <td>78.8</td>
    </tr>
    <tr>
      <td>French</td>
      <td>2.2</td>
      <td>68.2</td>
      <td>77.2</td>
    </tr>
    <tr>
      <td>Russian</td>
      <td>1.0</td>
      <td>33.2</td>
      <td>69.2</td>
    </tr>
    <tr>
      <td>Italian</td>
      <td>0.9</td>
      <td>76.8</td>
      <td>86.1</td>
    </tr>
    <tr>
      <td>Portuguese</td>
      <td>0.8</td>
      <td>75.8</td>
      <td>84.8</td>
    </tr>
    <tr>
      <td>Occitan</td>
      <td>0.7</td>
      <td>66.5</td>
      <td>73.8</td>
    </tr>
    <tr>
      <td>Domain</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Other</td>
      <td>22.1</td>
      <td>61.3</td>
      <td>75.5</td>
    </tr>
    <tr>
      <td>Gov’t. & Admin.</td>
      <td>17.3</td>
      <td>75.3</td>
      <td>82.8</td>
    </tr>
    <tr>
      <td>Commerce & Tax</td>
      <td>11.0</td>
      <td>70.6</td>
      <td>78.8</td>
    </tr>
    <tr>
      <td>Engineering</td>
      <td>7.1</td>
      <td>66.5</td>
      <td>78.4</td>
    </tr>
    <tr>
      <td>Data & Privacy</td>
      <td>6.1</td>
      <td>74.3</td>
      <td>83.0</td>
    </tr>
    <tr>
      <td>Law & Justice</td>
      <td>6.0</td>
      <td>72.1</td>
      <td>79.7</td>
    </tr>
    <tr>
      <td>Health</td>
      <td>5.8</td>
      <td>70.9</td>
      <td>77.6</td>
    </tr>
    <tr>
      <td>Education</td>
      <td>5.7</td>
      <td>76.1</td>
      <td>80.3</td>
    </tr>
    <tr>
      <td>Environment</td>
      <td>5.1</td>
      <td>80.8</td>
      <td>84.8</td>
    </tr>
    <tr>
      <td>Transportation</td>
      <td>4.0</td>
      <td>64.6</td>
      <td>78.7</td>
    </tr>
    <tr>
      <td>Culture & Religion</td>
      <td>3.7</td>
      <td>80.8</td>
      <td>83.7</td>
    </tr>
    <tr>
      <td>Real Estate</td>
      <td>2.4</td>
      <td>83.3</td>
      <td>88.9</td>
    </tr>
    <tr>
      <td>Technology</td>
      <td>2.6</td>
      <td>75.4</td>
      <td>79.2</td>
    </tr>
    <tr>
      <td>Sports & Rec.</td>
      <td>1.1</td>
      <td>72.0</td>
      <td>85.7</td>
    </tr>
  </tbody>
</table>

all forms. Using this dataset, we train a family of high-resolution object detectors, FFDNet-S and FFDNet-L. We show that FFDNet-L qualitatively yet clearly outperforms Adobe Acrobat at form field detection on a test set of forms. We release the preparation code, dataset, and models open source.

In future work, we seek to tackle the complete problem of form preparation, by building datasets and models that capture the semantics of forms. In addition, we believe that there are several potential avenues to improve FFDNet, including bringing in recent work in object detection. In particular, performance on scans and foreign language documents can be improved, possibly via some form of data augmentation or resampling. There are likely to be gains cleaning up the form preparation inconsistencies noted in Section 3.2.