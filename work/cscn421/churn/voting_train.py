# CSCN 421 Lab 1. Taken from HerwigB_Lab1.knwf, Python Script (#18).
# Script body unchanged.

import knime.scripting.io as knio

from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.ensemble import VotingClassifier

df = knio.input_tables[0].to_pandas()

y = df["Churn"]
X = df.drop(columns=["Churn"])

knn = KNeighborsClassifier(n_neighbors=13)
svm = SVC(kernel="rbf", probability=True)

ensemble = VotingClassifier(
    estimators=[
        ("knn", knn),
        ("svm", svm)
    ],
    voting="soft"
)

ensemble.fit(X, y)

knio.output_tables[0] = knio.Table.from_pandas(df)
knio.output_objects[0] = ensemble