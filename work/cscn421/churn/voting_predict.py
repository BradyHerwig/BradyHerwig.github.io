# CSCN 421 Lab 1. Taken from HerwigB_Lab1.knwf, Python Script (#37).
# Script body unchanged.

import knime.scripting.io as knio
import pandas as pd

input_table = knio.input_tables[0].to_pandas()
model = knio.input_objects[0]

X = input_table.drop(columns=["Churn"])

pred = model.predict(X)

yes_index = list(model.classes_).index("Yes")
proba_yes = model.predict_proba(X)[:, yes_index]

no_index = list(model.classes_).index("No")
proba_no = model.predict_proba(X)[:, no_index]

output_table = pd.DataFrame({
    "Churn": input_table["Churn"].values,
    "prob_vote_Yes": proba_yes,
    "prob_vote_No": proba_no,
    "pred_vote": pred
}, index=input_table.index)

knio.output_tables[0] = knio.Table.from_pandas(output_table)