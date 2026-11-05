# CSCN 421 Lab 1. Taken from HerwigB_Lab1.knwf, Python Script (#35).
# Script body unchanged.

import knime.scripting.io as knio

test = knio.input_tables[0].to_pandas()
model = knio.input_objects[0]

X = test.drop(columns=["Churn"])

out = test.copy()
out["pred_knn_python"] = model.predict(X)

yes_index = list(model.classes_).index("Yes")
out["prob_knn_python_yes"] = model.predict_proba(X)[:, yes_index]

no_index = list(model.classes_).index("No")
out["prob_knn_python_no"] = model.predict_proba(X)[:, no_index]

knio.output_tables[0] = knio.Table.from_pandas(out)