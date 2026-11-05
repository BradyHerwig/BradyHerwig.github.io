# CSCN 421 Lab 4. Loads model.pkl and scores churn_test.csv. No training.
# The CSV and pickle stay in the course folder.

import numpy as np
import pandas as pd
import pickle
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# Load model
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

syn0 = model["syn0"]
b0   = model["b0"]
syn1 = model["syn1"]
b1   = model["b1"]

print("syn0:", syn0.shape)
print("syn1:", syn1.shape)

# Load test data
df_test = pd.read_csv(r"churn_test.csv")
y_test = (df_test["Churn"] == "Yes").astype(float).values.reshape(-1, 1)
X_test = df_test.drop(columns=["Churn"]).values

print("X_test shape:", X_test.shape)
print("y_test shape:", y_test.shape)
print("Test Yes ratio:", y_test.mean())

# Forward pass
z1 = X_test @ syn0 + b0
l1 = 1 / (1 + np.exp(-z1))
z2 = l1 @ syn1 + b1
l2 = 1 / (1 + np.exp(-z2))

# Predictions
preds = (l2 >= 0.5).astype(int)

print("\nTest accuracy:", accuracy_score(y_test, preds))
print("Predicted Yes ratio:", preds.mean())
print()
print("Classification Report:")
print(classification_report(y_test, preds, target_names=["No", "Yes"]))
print()
print("Confusion Matrix:")
print(confusion_matrix(y_test, preds))
print("\nThreshold used: 0.5")