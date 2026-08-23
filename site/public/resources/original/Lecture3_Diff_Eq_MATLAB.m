%% Clear workspace before starting work

clear all;

%% Part 1

dt = 0.001; % Delta t in seconds
T = 0.250; % Simulation duration in seconds
t_values = 0:dt:T; 
num_t = length(t_values);

tau = 0.01; % Time constant in seconds
omega = 220; % Input oscillation frequency in radians per second
t0 = 0.150; % Input oscillation frequency in seconds

% Define input pattern
I = NaN(num_t,1);
for t = 1:num_t % There are more numerically efficient ways to do this, but this is fast enough for this problem, and I thought it would be a useful demonstration
    if t_values(t) < 0.050
        I(t) = 0;
    elseif t_values(t) < 0.100
        I(t) = 2;
    elseif t_values(t) < 0.150
        I(t) = 1;
    elseif t_values(t) < 0.200
        I(t) = cos(omega*(t_values(t)-t0));
    elseif t_values(t) < 0.250
        I(t) = 0;
    end
end

x = NaN(num_t,1);
x0 = 0;
x(1) = x0;
for t = 2:num_t
    x(t) = x(t-1)+dt/tau*(-x(t-1)+I(t-1));
end

close all;
figure,
subplot(1,2,1)
plot(t_values,I);
subplot(1,2,2)
plot(t_values,x);

%% Part 2

dt = 0.0001; % Delta t in au
T = 10; % Simulation duration in au
 
t_values = 0:dt:T; 
num_t = length(t_values);

x = NaN(num_t,2);
x1_0 = 0;
x2_0 = 1;
x(1,:) = [x1_0, x2_0];
for t = 2:num_t
    x(t,1) = x(t-1,1)+dt*(x(t-1,2));
    x(t,2) = x(t-1,2)+dt*(-x(t-1,1));
end

close all;

figure,
subplot(1,2,1)
plot(t_values,x(:,1))
subplot(1,2,2)
plot(t_values,x(:,2))
