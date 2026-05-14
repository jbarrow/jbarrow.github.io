552,872,1145,872,1145,903,552,903,Figure 1. Overview of form ﬁeld detection and preparation.
161,962,817,962,817,1014,161,1014,Input , Signature } . This means that, unlike Adobe Ac-
161,996,817,996,817,1029,161,1029,robat and Apple Preview, FFDNet can predict the location
161,1029,817,1029,817,1061,161,1061,of choice buttons (i.e. checkboxes and radio buttons). As
161,1061,817,1061,817,1096,161,1096,of the time of publication, these tools only predict text form
161,1096,227,1096,227,1128,161,1128,ﬁelds.
195,1130,817,1130,817,1163,195,1163,The FFDNet models are high-resolution (1216px)
161,1163,817,1163,817,1197,161,1197,YOLO11 [ 11 ] object detectors. Our ablation results show
161,1197,817,1197,817,1229,161,1229,that high-resolution inputs are crucial to quality; models
161,1229,817,1229,817,1264,161,1264,trained on 10k pages at varying resolutions show a range
161,1264,660,1264,660,1296,161,1296,of roughly 20 mean average precision points.
195,1298,557,1298,557,1331,195,1331,Our contributions are as follows:
161,1331,817,1331,817,1367,161,1367,• we prepare release C OMMON F ORMS , a large, diverse,
185,1365,720,1365,720,1399,185,1399,and high quality dataset for form ﬁeld detection;
161,1397,817,1397,817,1434,161,1434,• we train and release a family of form ﬁeld detec-
185,1432,817,1432,817,1468,185,1468,tion models on C OMMON F ORMS , FFDNet-Small and
185,1464,368,1464,368,1499,185,1499,FFDNet-Large 1 ;
161,1497,817,1497,817,1533,161,1533,• we provide an in depth analysis of C OMMON F ORMS to
185,1531,766,1531,766,1565,185,1565,identify the represented languages and domains; and
161,1564,817,1564,817,1600,161,1600,• we compare the FFDNet models against the most pop-
185,1598,817,1598,817,1634,185,1634,ular commercial system , Adobe Acrobat, and show that
185,1632,715,1632,715,1665,185,1665,they produce substantially higher quality forms.
161,1697,392,1697,392,1741,161,1741,2. Related Work
161,1758,817,1758,817,1791,161,1791,Machine-learning-based work on document forms can be
161,1791,817,1791,817,1825,161,1825,viewed as two broad categories: form preparation and form
161,1825,817,1825,817,1858,161,1858,understanding. Form preparation is the task of making a
161,1858,817,1858,817,1892,161,1892,form ﬁllable, whether that is detecting widgets or building
161,1892,817,1892,817,1925,161,1925,a semantic model of the form. Form understanding, also
191,1951,586,1951,586,1980,191,1980,1 supported by a LambdaLabs compute grant
880,962,1536,962,1536,994,880,994,known as key information extraction (KIE), is an informa-
880,996,1536,996,1536,1029,880,1029,tion extraction task on ﬁlled-out document forms. This pa-
880,1029,1536,1029,1536,1061,880,1061,per is an instance of form preparation, which is the smaller
880,1061,1104,1061,1104,1096,880,1096,of the two subﬁelds.
880,1147,1345,1147,1345,1184,880,1184,Form Preparation and Understanding
1373,1149,1536,1149,1536,1182,1373,1182,Representative
880,1182,1536,1182,1536,1216,880,1216,work on form preparation includes the line of work on
880,1216,1536,1216,1536,1248,880,1248,Form2Seq [ 1 , 2 ] and FormA11y [ 18 ]. Form2Seq formalizes
880,1248,1536,1248,1536,1281,880,1281,a semantic form model, treating it as a joint classiﬁcation
880,1281,1536,1281,1536,1315,880,1315,and grouping task. Lower-level elements like widgets and
880,1315,1536,1315,1536,1348,880,1348,text blocks are ﬁrst classiﬁed into, e.g. ChoiceButton
880,1348,1536,1348,1536,1382,880,1382,or TextField , and then grouped into higher-order cate-
880,1382,1536,1382,1536,1415,880,1415,gories like ChoiceGroup . However, it is assumed that
880,1415,1536,1415,1536,1447,880,1447,the interactive form widgets have already been correctly
880,1447,1536,1447,1536,1481,880,1481,detected. FormA11y takes a human-in-the-loop approach
880,1481,1536,1481,1536,1514,880,1514,in which users match labels to widgets to create accessible
880,1514,1536,1514,1536,1548,880,1548,forms. In contrast to both of these, C OMMON F ORMS in-
880,1548,1536,1548,1536,1581,880,1581,troduces a large-scale dataset and baseline models for auto-
880,1581,1536,1581,1536,1613,880,1613,matic detection of the form ﬁelds themselves, allowing the
880,1613,1487,1613,1487,1648,880,1648,end-to-end preparation of a form from a ﬂat document.
912,1650,1536,1650,1536,1682,912,1682,Form understanding (KIE) focuses on extracting key-
880,1682,1536,1682,1536,1716,880,1716,value pairs from completed forms. Common form under-
880,1716,1536,1716,1536,1749,880,1749,standing datasets tend to be small, such as FUNSD [ 10 ]
880,1749,1536,1749,1536,1781,880,1781,(199 labeled forms), and NAF [ 5 ] (77 labeled forms).
880,1781,1536,1781,1536,1816,880,1816,Methodologically, work in the area has employed a diverse
880,1816,1536,1816,1536,1848,880,1848,body of models, including: purely visual models, such as
880,1848,1536,1848,1536,1882,880,1882,image segmentation [ 23 ]; purely textual models, such as
880,1882,1536,1882,1536,1915,880,1915,BERT [ 7 ]; multimodal models that can model vision, text,
880,1915,1536,1915,1536,1947,880,1947,and layout information jointly, such as the LayoutLM se-
880,1947,1536,1947,1536,1982,880,1982,ries [ 8 , 25 , 26 ]; as well as vision and graph-based models