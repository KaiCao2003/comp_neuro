%% Clear workspace before starting work

clear all;

%% Problem 1

% Bullet 1
s = 2;
u = [0; 1];
v = [2; 5];
w = [0; 1; 2; 5];
A = [0 0.5; 10 1; 2 9; 2 7];
B = [4 4; 8 9];
C = [3 4; 6 8];

% Well-defined mathematical objects
u+v
B+C

% Imprecise MATLAB notation
s+A
s+A-A

% Bullet 2
dot(u,v)

% Bullet 3
norm(w)
sqrt(dot(w,w))

% Bullet 5
A*v

% Bullet 6
B*C

% Bullet 7
eye(3)

% Bullet 8
A'

% Bullet 10
inv(B)
inv(C)

% BUllet 11
det(s)
det(B)
det(C)

% Bullet 12
u.*v
B.*C

