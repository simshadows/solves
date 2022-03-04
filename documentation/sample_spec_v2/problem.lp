%%% initial user input:
%%% colour vertex

%%% domain spec:
%%% { domain(edge(V1, V2)) } :- base(vertex, V1), base(vertex, V2).

%%% subsequent user input:
%%% edge/2

%%% solver output:
%%% colour/2

%%% logic spec:

{ solution(color(V,C)) } :- base(vertex, V), base(colour, C).
coloured(V) :- solution(color(V,C)).
:- base(vertex, V), not coloured(V).
:- solution(color(V,C1)), solution(color(V,C2)), C1 != C2.
:- instance(edge(V1, V2)), solution(color(V1, C)), solution(color(V2, C)).
#show.
#show X : solution(X).

