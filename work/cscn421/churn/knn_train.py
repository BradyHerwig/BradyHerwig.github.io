# CSCN 421 Lab 1. Taken from HerwigB_Lab1.knwf, Python Script (#15).
# Script body unchanged.

import knime.scripting.io as knio
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import make_scorer, recall_score

train = knio.input_tables[0].to_pandas()

y = train["Churn"]
X = train.drop(columns=["Churn"])

grid = {
    "n_neighbors": [3, 5, 7, 11, 13, 15],
    "weights": ["uniform", "distance"],
}

recall_yes = make_scorer(recall_score, pos_label="Yes")

search = GridSearchCV(
    KNeighborsClassifier(),
    grid,
    cv=5,
    scoring=recall_yes,
    refit=True,
)
search.fit(X, y)

print(search.best_params_)
print(search.best_score_)

knio.output_objects[0] = search.best_estimator_

results = pd.DataFrame([{
    "best_params": str(search.best_params_),
    "best_score": float(search.best_score_),
}])
knio.output_tables[0] = knio.Table.from_pandas(results)