import numpy as np

# initalizers
def glorot_uniform(fan_in: int, fan_out: int) -> np.ndarray:
    """Xavier/Glorot uniform: U[-√(6/(fan_in+fan_out)), √(6/(fan_in+fan_out))]."""
    limit = np.sqrt(6.0 / (fan_in + fan_out))
    return np.random.uniform(-limit, limit, size=(fan_in, fan_out))

def glorot_normal(fan_in: int, fan_out: int) -> np.ndarray:
    """Xavier/Glorot normal: N(0, √(2/(fan_in+fan_out)))."""
    std = np.sqrt(2.0 / (fan_in + fan_out))
    return np.random.randn(fan_in, fan_out) * std

def he_uniform(fan_in: int, fan_out: int) -> np.ndarray:
    """He (Kaiming) uniform: U[-√(6/fan_in), √(6/fan_in)] for ReLU/Leaky."""
    limit = np.sqrt(6.0 / fan_in)
    return np.random.uniform(-limit, limit, size=(fan_in, fan_out))

def he_normal(fan_in: int, fan_out: int) -> np.ndarray:
    """He (Kaiming) normal: N(0, √(2/fan_in)) for ReLU/Leaky."""
    std = np.sqrt(2.0 / fan_in)
    return np.random.randn(fan_in, fan_out) * std

def orthogonal(fan_in: int, fan_out: int, gain: float = 1.0, *, seed: int | None = None) -> np.ndarray:
    """Orthogonal via QR, scaled by gain (use ~√2 for ReLU, ~5/3 for tanh, 1.0 otherwise)."""
    if seed is not None:
        rng = np.random.RandomState(seed)
        a = rng.randn(fan_in, fan_out)
    else:
        a = np.random.randn(fan_in, fan_out)
    q, r = np.linalg.qr(a, mode="reduced")
    q *= np.sign(np.diag(r))
    if q.shape != (fan_in, fan_out):  # pad/slice if rectangular edge case
        m = max(fan_in, fan_out)
        a2 = np.random.randn(m, m)
        q2, r2 = np.linalg.qr(a2)
        q2 *= np.sign(np.diag(r2))
        q = q2[:fan_in, :fan_out]
    return gain * q

# activations
def sigmoid(x, deriv: bool = False):
    """Sigmoid; deriv expects ACTIVATION a and returns a*(1-a)."""
    if deriv:
        a = x
        return a * (1.0 - a)
    return 1.0 / (1.0 + np.exp(-x))

def tanh_act(x, deriv: bool = False):
    """tanh; deriv expects ACTIVATION a and returns 1-a^2."""
    if deriv:
        a = x
        return 1.0 - a**2
    return np.tanh(x)

def relu(x, deriv: bool = False):
    """ReLU; deriv expects ACTIVATION a and returns 1 where a>0 else 0."""
    if deriv:
        a = x
        return (a > 0).astype(float)
    return np.maximum(0.0, x)

def leaky_relu(x, deriv: bool = False, alpha: float = 0.01):
    """LeakyReLU (alpha default 0.01); deriv expects ACTIVATION a and returns 1 if a>0 else alpha."""
    if deriv:
        a = x
        return np.where(a > 0, 1.0, alpha)
    return np.where(x > 0, x, alpha * x)
