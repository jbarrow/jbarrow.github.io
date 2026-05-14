161,200,817,200,817,234,161,234,show a breakdown of the top 10 most common languages
161,234,770,234,770,267,161,267,and our form ﬁeld detection results on them in Table 5 .
195,269,817,269,817,303,195,303,Unsurprisingly, English-language forms make up the
161,303,817,303,817,336,161,336,majority of the dataset at 63.6%. However, the other third
161,336,817,336,817,368,161,368,of forms come from a broad set of languages and language
161,368,817,368,817,402,161,402,families, including Cantonese, German, Korean, Spanish,
161,402,817,402,817,435,161,435,French, and others. As part of C OMMON F ORMS , we release
161,435,812,435,812,469,161,469,the per-page text, the language, and the classiﬁed domains.
161,492,498,492,498,532,161,532,3.4. Domain Classiﬁcation
161,548,817,548,817,580,161,580,In order to understand the domains from which the forms
161,580,817,580,817,613,161,613,originate, we use topic modeling [ 4 ], both to identify candi-
161,613,817,613,817,647,161,647,date domains and to classify the pages. To train topic mod-
161,647,817,647,817,679,161,679,els, we repurpose the extracted text from all pages, remove
161,679,817,679,817,714,161,714,stopwords, and train a topic model using LDA with MAL-
161,712,817,712,817,746,161,746,LET [ 17 ]. The topic model was trained with 300 topics.
161,746,817,746,817,779,161,779,We then used GPT-5 to label each topic with a primary do-
161,779,817,779,817,813,161,813,main and a language. Mixed or unclear topics were labeled
161,813,817,813,817,846,161,846,as Other, and English-language topics were manually veri-
161,846,817,846,817,878,161,878,ﬁed. The prompt, code, and topic state are all released as
161,878,468,878,468,912,161,912,artefacts alongside the data.
195,914,817,914,817,947,195,947,This process resulted in 14 domains. The results of the
161,947,671,947,671,981,161,981,domain classiﬁcation are shown in Table 5 .
696,947,817,947,817,981,696,981,Outside of
161,981,817,981,817,1014,161,1014,Other, the ﬁve most common domains were (1) Government
161,1014,817,1014,817,1046,161,1046,and Administrative, (2) Commerce and Tax, (3) Engineer-
161,1046,720,1046,720,1080,161,1080,ing, (4) Data and Privacy, and (5) Law and Justice.
161,1113,309,1113,309,1157,161,1157,4. FFDNet
161,1174,817,1174,817,1208,161,1208,We cast form ﬁeld detection as an object detection task
161,1208,817,1208,817,1241,161,1241,with three classes (the 4 widget types available in a PDF):
161,1241,817,1241,817,1273,161,1273,Choice Button , which encompasses checkboxes and
161,1273,817,1273,817,1308,161,1308,radio buttons; Text Input ; and Signature . We train
161,1308,817,1308,817,1340,161,1340,and release two object detectors based on YOLO11, initial-
161,1340,817,1340,817,1375,161,1375,ized from scratch: FFDNet-Small, (9 million parameters)
161,1371,698,1371,698,1409,161,1409,and FFDNet-Large, (25 million parameters) 2 .
195,1409,817,1409,817,1441,195,1441,Both FFDNet models are trained to accept high-
161,1441,817,1441,817,1476,161,1476,resolution inputs, at 1216px. This is substantially higher
161,1476,817,1476,817,1508,161,1508,resolution than traditional object detection tasks, but later
161,1508,817,1508,817,1543,161,1543,experiments and results in Table 4 support the necessity of
161,1543,817,1543,817,1575,161,1575,high-resolution models. We use 1216px as it balances com-
161,1575,817,1575,817,1607,161,1607,putational efﬁciency of training and inference against per-
161,1607,817,1607,817,1642,161,1642,formance; as resolution scales beyond this batch sizes de-
161,1642,525,1642,525,1674,161,1674,crease and training times stretch.
195,1676,817,1676,817,1711,195,1711,The models are trained for 300 epochs with an initial
161,1711,817,1711,817,1743,161,1743,learning rate of 0.001. They are both trained on 4xV100
161,1741,817,1741,817,1776,161,1776,instances 3 . FFDNet-L took roughly 5 days to train, and
161,1776,817,1776,817,1810,161,1810,FFDNet-S took roughly 2 days to train. Hyperparameters
161,1810,817,1810,817,1842,161,1842,and input resolution were chosen by training several models
191,1871,817,1871,817,1902,191,1902,2 Due to a processing error, both models are only trained on 350k form
161,1900,817,1900,817,1926,161,1926,pages rather than the full 490k. We are working on retraining the models
161,1926,259,1926,259,1953,161,1953,for release.
191,1951,724,1951,724,1980,191,1980,3 Generously supplied via compute grant from LambdaLabs.
880,200,1536,200,1536,234,880,234,on subsets of C OMMON F ORMS and seeing how they gener-
880,234,1299,234,1299,267,880,267,alize as model and dataset sizes scale.
880,299,1267,299,1267,343,880,343,5. Experiments and Results
880,360,1536,360,1536,393,880,393,We report the performance of FFDNet-S and FFDNet-L in
880,393,1536,393,1536,441,880,441,Table 3 . All results are reported as mAP 50 − 95 . FFDNet-L
880,425,1478,425,1478,460,880,460,consistently outperforms FFDNet-S across all classes.
912,462,1536,462,1536,494,912,494,However, this performance comes at a cost of memory
880,494,1536,494,1536,528,880,528,and computatation. On a single 3090Ti, the inference of
880,528,1536,528,1536,561,880,561,FFDNet-L takes roughly 16ms per page, while the inference
880,561,1536,561,1536,593,880,593,of FFDNet-S takes roughly 5ms. FFDNet-S is better suited
880,593,1536,593,1536,628,880,628,for mobile or on-device applications, where memory and
880,628,1176,628,1176,660,880,660,compute are at a premium.
880,685,1502,685,1502,723,880,723,5.1. Resolution Matters In Form Field Detection
880,737,1536,737,1536,771,880,771,Compared with objects in traditional object detection, many
880,771,1536,771,1536,803,880,803,form ﬁelds are comparatively ﬁne in an average form. Cer-
880,803,1536,803,1536,836,880,836,tain features that signify where a form element should go,
880,836,1536,836,1536,870,880,870,such as underlines or colons, are also very ﬁne. A conse-
880,870,1536,870,1536,903,880,903,quence of this is that form ﬁeld detection is more sensitive
880,903,1447,903,1447,937,880,937,to input resolution than traditional object detection.
912,939,1536,939,1536,972,912,972,We examine this by ﬁnetuning a series of 6 million pa-
880,972,1536,972,1536,1004,880,1004,rameter FFDNet model on a dataset of 10k pages from
880,1004,1085,1004,1085,1038,880,1038,C OMMON F ORMS .
1117,1004,1436,1004,1436,1038,1117,1038,We compare 4 resolutions:
1460,1004,1536,1004,1536,1038,1460,1038,640px,
880,1038,1536,1038,1536,1071,880,1071,960px, 1216px, and 1536px, and show the results in Ta-
880,1071,1536,1071,1536,1105,880,1105,ble 4 . Results are reported on the C OMMON F ORMS test set,
880,1103,1536,1103,1536,1138,880,1138,so are directly comparable with all other results reported in
880,1138,986,1138,986,1170,880,1170,the paper.
912,1172,1536,1172,1536,1206,912,1206,The results show that resolution is tremendously im-
880,1206,1536,1206,1536,1239,880,1239,portant. Continuing to 1536px the small models improve
880,1239,1303,1239,1303,1273,880,1273,in performance across all categories.
1326,1239,1536,1239,1536,1273,1326,1273,The differences in
880,1271,1536,1271,1536,1306,880,1306,performance are stark; there is roughly a 20 point differ-
880,1306,1536,1306,1536,1338,880,1338,ence from 640px to 1536px. The Choice Button and
880,1338,1536,1338,1536,1373,880,1373,Signature form ﬁelds are most impacted by resolution.
880,1373,1536,1373,1536,1405,880,1405,This makes intuitive sense for Choice Button s, which
880,1405,1536,1405,1536,1438,880,1438,are often very small objects on a form page (radio buttons or
880,1438,1536,1438,1536,1472,880,1472,checkboxes). Distinguishing a signature from a textbox re-
880,1472,1536,1472,1536,1504,880,1504,quires a weak form of optical character recognition (OCR)
880,1504,1536,1504,1536,1539,880,1539,to determine the proximity of indicator words such as “Sig-
880,1539,1161,1539,1161,1571,880,1571,nature“ or “Unterschrift.”
912,1573,1536,1573,1536,1606,912,1606,The FFDNet models are trained at 1216px, a large size
880,1606,1536,1606,1536,1640,880,1640,for traditional object detection, but empirically a good
880,1640,1536,1640,1536,1672,880,1672,trade-off between speed and accuracy for form ﬁeld detec-
880,1672,929,1672,929,1705,880,1705,tion.
880,1730,1536,1730,1536,1770,880,1770,5.2. FFDNet Outperforms Adobe Acrobat at All
948,1762,1013,1762,1013,1802,948,1802,Sizes
880,1816,1536,1816,1536,1848,880,1848,We qualitatively compare FFDNet and Adobe Acrobat, with
880,1848,1536,1848,1536,1882,880,1882,results shown in Table 2 . Of note, Acrobat does not de-
880,1882,1536,1882,1536,1915,880,1915,tect choice buttons at all. Apple Preview also does not de-
880,1915,1536,1915,1536,1947,880,1947,tect choice buttons, instead using text inputs in place of all
880,1947,1536,1947,1536,1982,880,1982,choice buttons. Acrobat suffers from both low recall, miss-