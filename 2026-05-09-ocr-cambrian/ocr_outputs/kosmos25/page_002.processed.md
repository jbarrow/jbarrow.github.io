161,200,817,200,817,234,161,234,such as Visual FUDGE [ 6 ]. In this work, we tackle form
161,234,817,234,817,267,161,267,preparation rather than understanding, and cast the task as
161,267,817,267,817,301,161,301,one of object detection. That is, we do not attempt to extract
161,299,817,299,817,334,161,334,values, but to predict where on the page the slots for values
161,334,597,334,597,366,161,366,should be, based on visual information.
161,422,646,422,646,458,161,458,Object Detection in Document Images
673,422,817,422,817,456,673,456,Many docu-
161,456,817,456,817,488,161,488,ments are inherently multimodal, so there are many estab-
161,488,817,488,817,523,161,523,lished lines of research that cast document problems as vi-
161,523,817,523,817,555,161,555,sion problems, and speciﬁcally object detection. Examples
161,555,817,555,817,588,161,588,include layout detection (DocLayNet [ 19 ], PubLayNet [ 27 ],
161,588,817,588,817,622,161,622,Newspaper Navigator [ 14 ], PRImA Layout [ 3 ] ), table de-
161,622,817,622,817,655,161,655,tection (TableBank [ 16 ]), and math formula detection (For-
161,655,817,655,817,689,161,689,mulaNet [ 20 ]). LayoutParser [ 21 ] is a suite of tools that
161,687,817,687,817,721,161,721,provides a uniﬁed interface for all of these tasks. Depend-
161,721,817,721,817,754,161,754,ing on the resolution required, models such as YOLO [ 11 ],
161,754,817,754,817,788,161,788,the Document Image Transformer (DIT) [ 15 ], or Lay-
161,788,815,788,815,821,161,821,outLM [ 25 ], for multimodality, have been used. C OMMON -
161,821,817,821,817,853,161,853,F ORMS adopts the same paradigm for detecting form ﬁelds.
161,853,817,853,817,888,161,888,In this work, we treat documents as unimodal images and
161,888,817,888,817,920,161,920,train object detectors to localize and type form ﬁelds. The
161,920,817,920,817,954,161,954,outputs can be used as a complementary semantic layer in
161,954,502,954,502,987,161,987,addition to these other models.
161,1040,660,1040,660,1077,161,1077,Document Corpora from Common Crawl
686,1042,817,1042,817,1075,686,1075,ccPDF [ 22 ]
161,1075,817,1075,817,1107,161,1107,and FinePDFs [ 13 ] curate PDF corpora from Common
161,1107,817,1107,817,1142,161,1142,Crawl. Both datasets target visually and/or topically diverse
161,1142,817,1142,817,1174,161,1174,datasets. Like these efforts, C OMMON F ORMS is also drawn
161,1174,817,1174,817,1208,161,1208,from Common Crawl. However, in this work, the ﬁltering
161,1208,817,1208,817,1241,161,1241,and preparation is focused on mining well-annotated forms
161,1241,817,1241,817,1273,161,1273,which can be used as training signal for form ﬁeld detection.
161,1342,563,1342,563,1386,161,1386,3. C OMMON F ORMS Dataset
161,1403,817,1403,817,1438,161,1438,There is truth to the adage “quantity has a quality all its
161,1438,817,1438,817,1470,161,1470,own”. The core thesis of this paper is twofold: (1) there are
161,1470,817,1470,817,1504,161,1504,plentiful existing prepared forms in Common Crawl, and (2)
161,1504,817,1504,817,1537,161,1537,those forms are high-quality enough to be used as a train-
161,1537,817,1537,817,1569,161,1569,ing signal. With a few simple ﬁlters, we can bootstrap an
161,1569,817,1569,817,1604,161,1604,effective detector without the need for manual annotation.
161,1604,817,1604,817,1636,161,1636,Our goal is to ﬁlter to forms that have been well-prepared.
161,1636,817,1636,817,1671,161,1671,We start with a 8 million PDF sample of Common Crawl
161,1669,817,1669,817,1703,161,1703,prepared by the PDF Association [ 24 ] and apply a rigorous
161,1703,817,1703,817,1735,161,1735,cleaning process to arrive at the C OMMON F ORMS dataset.
161,1735,817,1735,817,1770,161,1770,This ﬁltering process is shown in Figure 2 , and the limita-
161,1770,796,1770,796,1802,161,1802,tions of this ﬁltering process are discussed in Section 3.2 .
161,1829,658,1829,658,1869,161,1869,3.1. Dataset Preparation and Cleaning
161,1882,817,1882,817,1917,161,1917,In order to make use of forms from the Web, we build a
161,1917,817,1917,817,1949,161,1949,ﬁltering pipeline that starts with our candidate set and grad-
161,1949,817,1949,817,1982,161,1982,ually reduces them to a clean set of forms. At every stage,
1098,227,1318,227,1318,257,1098,257,Common Crawl PDFs
1102,255,1312,255,1312,282,1102,282,CC-MAIN-2021-21
1261,338,1430,338,1430,368,1261,368,n = 7.9MM PDFs
1039,441,1377,441,1377,471,1039,471,Filter for PDFs Containing Forms
1013,469,1404,469,1404,496,1013,496,PDF contains AcroForm or XFA
1261,551,1405,551,1405,582,1261,582,n = 762k PDFs
1071,653,1345,653,1345,683,1071,683,Form Consistency Filtering
1138,683,1278,683,1278,710,1138,710,>0 widgets
935,714,1481,714,1481,740,935,740,>0 non-button and non-signature widgets
1075,742,1341,742,1341,769,1075,769,remove tiny widgets
1026,773,1390,773,1390,800,1026,800,remove overlapping widgets
1013,803,1404,803,1404,830,1013,830,remove out of bounds widgets
1261,882,1394,882,1394,912,1261,912,n = 59k PDFs
1145,985,1303,985,1303,1015,1145,1015,CommonForms
1062,1015,1354,1015,1354,1042,1062,1042,59k PDFs ; 480k pages
960,1100,1457,1100,1457,1130,960,1130,Figure 2. Filtering pipeline for C OMMON F ORMS .
880,1201,1536,1201,1536,1233,880,1233,the pipeline applies a set of ﬁlter functions, shown in Fig-
880,1233,1536,1233,1536,1268,880,1268,ure 2 . We start with 7.9 million PDFs drawn from Common
880,1268,1536,1268,1536,1300,880,1300,Crawl gathered from the July/August 2021 scrape [ 24 ]. The
880,1300,1536,1300,1536,1332,880,1332,ﬁrst set of ﬁltering functions is used to ﬁnd PDFs that con-
880,1332,1073,1332,1073,1367,880,1367,tain form objects.
912,1373,1536,1373,1536,1405,912,1405,There are two standards for PDF forms: AcroForms and
880,1405,1536,1405,1536,1439,880,1439,the deprecated XML Forms Architecture (XFA) [ 9 ]. We
880,1439,1536,1439,1536,1472,880,1472,ﬁlter only documents that contain form objects from either
880,1472,1536,1472,1536,1504,880,1504,of these standards, reducing the pool of documents by about
880,1504,1109,1504,1109,1539,880,1539,90%, to 762k PDFs.
912,1544,1536,1544,1536,1577,912,1577,A PDF having a form object does not mean that it has
880,1577,1536,1577,1536,1611,880,1611,a well-annotated form, or even a form at all. The next set
880,1611,1536,1611,1536,1644,880,1644,of ﬁltering functions is used to improve the likelihood that
880,1644,1536,1644,1536,1676,880,1676,a document in the dataset is well annotated. We remove
880,1676,1536,1676,1536,1711,880,1711,documents that contain no form ﬁelds or that contain only
880,1711,1536,1711,1536,1743,880,1743,Button form ﬁelds. This second round of ﬁltering reduces
880,1743,1536,1743,1536,1777,880,1777,the set of forms by ¿90% once again, resulting in 59k PDFs.
912,1783,1536,1783,1536,1816,912,1816,To improve annotations, we clean the form ﬁelds them-
880,1816,1536,1816,1536,1848,880,1848,selves, removing ones that are marked as outside the box
880,1848,1536,1848,1536,1882,880,1882,of the page, that are too small to resolve, or that have high
880,1882,1536,1882,1536,1915,880,1915,enough overlap with existing elements as to be considered
880,1915,1536,1915,1536,1949,880,1949,near duplicates. In total, C OMMON F ORMS is 480k PDF
880,1949,950,1949,950,1982,880,1982,pages.