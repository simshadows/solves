% The contents below is Abdallah's work.

integer(groups,5).
integer(rounds,5).
base(player,alleson).
base(player,brad).
base(player,charlie).
base(player,danielle).
base(player,fredric).
base(player,george).
base(player,harriet).
base(player,ivan).
base(player,jenny).
base(player,karen).
base(player,laura).
base(player,mona).
base(player,nathan).
base(player,olive).
base(player,penelope).
base(player,rachel).
base(player,stan).
base(player,tom).
instance(disallowed(brad,danielle)).


% domain constraints
domainok(disallowed(P1,P2)) :- base(player,P1), base(player,P2), P1 != P2, instance(disallowed(P1,P2)).

% solution constaints
% output: assign/3
round(1..R) :- integer(rounds,R).
group(1..G) :- integer(groups,G).
size((N-1)/G+1) :- N = #count { P : base(player,P) }, integer(groups,G).
1 { assign(P, R, G) : group(G) } 1 :- base(player,P), round(R).
N - 1 { assign(P,R,G) : base(player,P) } N :- round(R), group(G), size(N).
same(P1, P2, R) :- assign(P1, R, G), assign(P2, R, G), P1 < P2.
:- same(P1,P2, R), instance(disallowed(P1,P2)).
:- same(P1,P2, R), instance(disallowed(P2,P1)).

:- same(P1, P2, R), same(P1, P2, S), R < S. %%% satisfaction constraint
%#minimize { 1,P1,P2,R,S : same(P1, P2, R), same(P1, P2, S), R < S }. %%% optimization constraint
