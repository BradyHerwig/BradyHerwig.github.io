# CSCN 421 Lab 4. Training loop for the churn split exported from Lab 1.
# NN_Helpers.py was provided with the course. The CSV sits next to this file
# in the course folder and is not published here.

import numpy as np
import pandas as pd
import pickle
from NN_Helpers import glorot_normal

def nonlin(x, deriv=False):
    if deriv:
        return x * (1 - x)
    return 1 / (1 + np.exp(-x))

def bce_loss(p, y, eps=1e-12):
    p = np.clip(p, eps, 1 - eps)
    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))

# Load train data
df = pd.read_csv(r"churn_train.csv")
y = (df["Churn"] == "Yes").astype(float).values.reshape(-1, 1)
X = df.drop(columns=["Churn"]).values

print("X shape:", X.shape)
print("y shape:", y.shape)
print("Actual Yes ratio:", y.mean())

# Initialize with Glorot
np.random.seed(42)
input_size = X.shape[1]
hidden_size = 32
output_size = 1

syn0 = glorot_normal(input_size, hidden_size)
b0   = np.zeros((1, hidden_size))
syn1 = glorot_normal(hidden_size, output_size)
b1   = np.zeros((1, output_size))

print("syn0:", syn0.shape)
print("syn1:", syn1.shape)

# Train
lr = 0.05
epochs = 3000
N = X.shape[0]

for e in range(epochs):
    z1 = X @ syn0 + b0
    l1 = nonlin(z1)
    z2 = l1 @ syn1 + b1
    l2 = nonlin(z2)

    loss = bce_loss(l2, y)

    delta2 = (l2 - y)
    d_syn1 = (l1.T @ delta2) / N
    d_b1   = delta2.mean(0, keepdims=True)

    delta1 = (delta2 @ syn1.T) * nonlin(l1, deriv=True)
    d_syn0 = (X.T @ delta1) / N
    d_b0   = delta1.mean(0, keepdims=True)

    syn1 -= lr * d_syn1
    b1   -= lr * d_b1
    syn0 -= lr * d_syn0
    b0   -= lr * d_b0

    if e % 300 == 0 or e == epochs - 1:
        print(f"epoch: {e:4d}  loss: {loss:.4f}")

# Final metrics
z1 = X @ syn0 + b0
l1 = nonlin(z1)
z2 = l1 @ syn1 + b1
l2 = nonlin(z2)

preds = (l2 >= 0.5).astype(int)
print("Training accuracy:", (preds == y).mean())
print("Predicted Yes ratio:", preds.mean())

# Save model
model = {
    "syn0": syn0,
    "b0": b0,
    "syn1": syn1,
    "b1": b1
}

with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

