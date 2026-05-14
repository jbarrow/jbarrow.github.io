256,286,1441,286,1441,338,256,338,C OMMON F ORMS : A Large, Diverse Dataset for Form Field Detection
774,399,923,399,923,439,774,439,Joe Barrow
688,437,1009,437,1009,477,688,477,Independent Researcher
658,486,1032,486,1032,511,658,511,joseph.d.barrow@gmail.com
428,588,552,588,552,632,428,632,Abstract
161,662,817,662,817,695,161,695,This paper introduces CommonForms, a web-scale dataset
161,695,817,695,817,729,161,729,for form ﬁeld detection. It casts the problem of form ﬁeld
161,729,817,729,817,761,161,761,detection as object detection: given an image of a page,
161,761,817,761,817,794,161,794,predict the location and type ( Text Input , Choice
161,796,817,796,817,828,161,828,Button , Signature ) of form ﬁelds. The dataset is con-
161,828,817,828,817,861,161,861,structed by ﬁltering Common Crawl to ﬁnd PDFs that have
161,861,817,861,817,895,161,895,ﬁllable elements. Starting with 8 million documents, the ﬁl-
161,895,817,895,817,928,161,928,tering process is used to arrive at a ﬁnal dataset of roughly
161,928,817,928,817,960,161,960,55k documents that have more than 450k pages. Analy-
161,962,817,962,817,994,161,994,sis shows that the dataset contains a diverse mixture of
161,994,817,994,817,1027,161,1027,languages and domains; one third of the pages are non-
161,1027,817,1027,817,1061,161,1061,English, and among the 14 classiﬁed domains, no domain
161,1061,605,1061,605,1094,161,1094,makes up more than 25% of the dataset.
193,1096,817,1096,817,1128,193,1128,In addition, this paper presents a family of form ﬁeld
161,1128,817,1128,817,1163,161,1163,detectors, FFDNet-Small and FFDNet-Large, which attain
161,1163,817,1163,817,1195,161,1195,a very high average precision on the CommonForms test
161,1195,817,1195,817,1227,161,1227,set. Each model cost less than $500 to train. Ablation re-
161,1227,817,1227,817,1260,161,1260,sults show that high-resolution inputs are crucial for high-
161,1262,817,1262,817,1294,161,1294,quality form ﬁeld detection, and that the cleaning process
161,1294,817,1294,817,1327,161,1327,improves data efﬁciency over using all PDFs that have ﬁll-
161,1327,817,1327,817,1361,161,1361,able ﬁelds in Common Crawl. A qualitative analysis shows
161,1361,817,1361,817,1394,161,1394,that they outperform a popular and commercially available
161,1394,817,1394,817,1426,161,1426,PDF reader that can prepare forms. Unlike the most pop-
161,1428,817,1428,817,1460,161,1460,ular commercially available solutions, FFDNet can predict
161,1460,817,1460,817,1493,161,1493,checkboxes in addition to text and signature ﬁelds. This
161,1493,817,1493,817,1527,161,1527,is, to our knowledge, the ﬁrst large-scale dataset released
161,1527,817,1527,817,1560,161,1560,for form ﬁeld detection, as well as the ﬁrst open-source
161,1560,817,1560,817,1592,161,1592,models. The dataset, models, and code will be released at
161,1594,798,1594,798,1627,161,1627,https://github.com/jbarrow/commonforms .
161,1690,375,1690,375,1732,161,1732,1. Introduction
161,1749,817,1749,817,1781,161,1781,Despite decades of digitalization, a large volume of real-
161,1781,817,1781,817,1816,161,1816,world transactions still center around paper forms: insur-
161,1816,817,1816,817,1848,161,1848,ance claims, municipal paperwork, school permission slips,
161,1848,817,1848,817,1882,161,1882,and many, many others. These documents are often dis-
161,1882,817,1882,817,1915,161,1915,tributed as scans or non-ﬁllable (“ﬂat”) PDFs, and require
161,1915,817,1915,817,1947,161,1947,either printing, tedious software workarounds, or turning to
161,1947,817,1947,817,1982,161,1982,a proprietary solution like Adobe Acrobat or Apple Preview.
880,595,1536,595,1536,628,880,628,In order to be digitally ﬁlled, a ﬂat form must be prepared
880,628,1536,628,1536,660,880,660,by having interactive form ﬁelds inserted. Although pro-
880,660,1536,660,1536,695,880,695,prietary solutions may employ machine learning to prepare
880,695,1536,695,1536,727,880,727,forms, there is not yet a high-quality open-source machine
880,727,1536,727,1536,761,880,761,learning-based system that can automatically and reliably
880,760,1125,760,1125,794,880,794,prepare ﬁllable forms.
912,798,1536,798,1536,832,912,832,Converting a ﬂat PDF to an accessible form — one that
880,832,1536,832,1536,865,880,865,can be understood by a screen reader, or ﬁlled automatically
880,865,1225,865,1225,899,880,899,— typically requires two steps:
880,901,1536,901,1536,937,880,937,1. form ﬁeld detection : detecting the locations and types
914,935,1440,935,1440,970,914,970,(e.g. text or checkbox) of ﬁllable elements; and
880,968,1536,968,1536,1004,880,1004,2. form enrichment : grouping the ﬁllable elements and
914,1002,1436,1002,1436,1035,914,1035,their labels based on the semantics of the form.
912,1038,1536,1038,1536,1073,912,1073,Previous work has primarily focused on the second [ 1 ,
880,1073,1536,1073,1536,1105,880,1105,2 ]. In this work, we tackle the ﬁrst problem by detecting
880,1105,1536,1105,1536,1140,880,1140,where the ﬁllable elements should go visually in a PDF. To
880,1140,1536,1140,1536,1172,880,1172,this end, we construct and release both a large-scale dataset,
880,1172,1536,1172,1536,1205,880,1205,C OMMON F ORMS , consisting of more than 480k pages from
880,1205,1235,1205,1235,1239,880,1239,more than 59k document forms.
912,1243,1536,1243,1536,1275,912,1275,We also train and release a family of form ﬁeld detection
880,1275,1536,1275,1536,1310,880,1310,models trained on this dataset, FFDNet-Small and FFDNet-
880,1308,1536,1308,1536,1344,880,1344,Large. Training each of these models costs roughly $500 of
880,1342,1536,1342,1536,1376,880,1376,compute or less , and yet these models are capable of high-
880,1376,1536,1376,1536,1409,880,1409,quality form ﬁeld detection. They achieve a high average
880,1409,1536,1409,1536,1441,880,1441,precision of more than 80 on the C OMMON F ORMS test set.
880,1441,1536,1441,1536,1476,880,1476,We perform a qualitative analysis of these models against
880,1476,1536,1476,1536,1508,880,1508,Adobe Acrobat and show that FFDNet has better recall and
880,1508,1138,1508,1138,1543,880,1543,precision than Acrobat.
914,1546,1536,1546,1536,1579,914,1579,C OMMON F ORMS is drawn from a large collection of in-
880,1579,1536,1579,1536,1611,880,1611,teractive PDF forms scraped from the Internet. The core
880,1611,1536,1611,1536,1646,880,1646,insight of this paper is that “quantity has a quality all its
880,1646,1536,1646,1536,1678,880,1678,own,” and that we can leverage existing ﬁllable forms as a
880,1678,1536,1678,1536,1713,880,1713,training signal. We use Common Crawl as a wellspring of
880,1713,1536,1713,1536,1745,880,1745,PDFs and apply a rigorous cleaning process. This clean-
880,1745,1536,1745,1536,1777,880,1777,ing process results in improved data efﬁciency compared to
880,1777,1263,1777,1263,1812,880,1812,using every PDF with a form ﬁeld.
912,1816,1536,1816,1536,1848,912,1848,To train the FFDNet family of models, we cast the prob-
880,1848,1536,1848,1536,1882,880,1882,lem of form ﬁeld detection as a pure object detection prob-
880,1882,1536,1882,1536,1915,880,1915,lem. Given a page image, the goal is to predict the lo-
880,1915,1347,1915,1347,1947,880,1947,cation and types of each form element.
1375,1915,1536,1915,1536,1947,1375,1947,The types are
880,1947,1536,1947,1536,2001,880,2001,drawn from teh following set: { Choice Button , Text
30,614,104,614,104,1583,30,1583,arXiv:2509.16506v1  [cs.CV]  20 Sep 2025