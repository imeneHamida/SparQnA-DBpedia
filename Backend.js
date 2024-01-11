// the function that handles question submission
function submitQuestion() {
    var selectedQuestion = document.getElementById("questionSelect").value;
    var variableName = getVariableName(selectedQuestion);
    var sparqlQuery = constructSPARQLQuery(selectedQuestion, variableName);

    fetch('http://dbpedia.org/sparql?query=' + encodeURIComponent(sparqlQuery) + '&format=json')
        .then(response => response.json())
        .then(data => displayAnswer(data, variableName));
}


//  the function that constructs the sparql query
function constructSPARQLQuery(questionId, variableName) {
    if (questionId === "1") {
        return `
            SELECT ?${variableName}
            WHERE {
                <http://dbpedia.org/resource/Turkey> <http://dbpedia.org/property/${variableName}> ?${variableName}.
            }
        `;
    }
    if (questionId === "2") {
        return `
            PREFIX dbo: <http://dbpedia.org/ontology/>
            PREFIX dbp: <https://dbpedia.org/property/>
            
            SELECT DISTINCT ?${variableName}
            WHERE { 
            ?${variableName} a dbo:SoccerPlayer ;
                            (dbo:position|dbp:position) ?position ;
                            dbo:birthDate ?birth.
            
            FILTER (?position = <http://dbpedia.org/resource/Forward_(association_football)> && ?birth = "1987-06-24"^^xsd:date)
            } 
            ORDER BY ?soccerplayer
            LIMIT 1
        `;
    }
    if (questionId === "3") {
        return `
            PREFIX dbo: <http://dbpedia.org/ontology/>

            SELECT ?${variableName}
            WHERE {
                ?${variableName} a dbo:Country ;
                        dbo:areaTotal ?area .
            }
            ORDER BY DESC(?area)
            LIMIT 1
            OFFSET 1
        `;
    }
    if (questionId === "4") {
        return `
            PREFIX dbo: <http://dbpedia.org/ontology/>

            SELECT ?${variableName}
            WHERE {
                ?${variableName} a dbo:Film .
                OPTIONAL { ?film dbo:director <https://dbpedia.org/page/David_Fincher> }
            }
            LIMIT 1
        `;
    }
    if (questionId === "5") {
        return `
            PREFIX dbo: <http://dbpedia.org/ontology/>

            SELECT ?${variableName}
            WHERE {
                ?author a dbo:Person ;
                        dbo:notableWork/dbo:${variableName} ?genre ;
                        dbo:notableWork ?book .
            }
            GROUP BY ?genre
            ORDER BY DESC(COUNT(?book))
            LIMIT 1
        `;
    }
    if (questionId === "6") {
        return `
            SELECT ?${variableName}
            WHERE {
                <http://dbpedia.org/resource/Canada> <http://dbpedia.org/property/${variableName}> ?${variableName}.
            }
        `;
    }

    if (questionId === "7") {
        return `
            SELECT ?${variableName}
            WHERE {
                <http://dbpedia.org/resource/The_Hunger_Games> <http://dbpedia.org/property/${variableName}> ?${variableName}.
            }
        `;
    }
    if (questionId === "8") {
        return `
            SELECT *
            WHERE {
                <http://dbpedia.org/resource/Sudan> <http://dbpedia.org/property/${variableName}> ?${variableName}.
            }
        `;
    }
    if (questionId === "9") {
        return `
            SELECT *
            WHERE {
                <http://dbpedia.org/resource/Harry_Potter> <http://dbpedia.org/property/${variableName}> ?${variableName}.
            }
        `;
    }

    if (questionId === "10") {
        return `
        PREFIX dbo: <http://dbpedia.org/ontology/>

        SELECT ?${variableName}
        WHERE {
            {
                ?animal a dbo:Mammal.
            }
            UNION {
                ?animal a dbo:Bird.
            }
        }
        LIMIT 1
    `;
    }
}

// the function the displays the answer
function displayAnswer(data, variableName) {
    var uri = data.results.bindings[0][variableName].value;
    var answer = uri.split('/').pop();

    document.getElementById("answer").innerHTML = "The Answer is:  " + answer;
}

// the function that gives values to the variable based on the question id
function getVariableName(questionId) {
    const variableNames = {
        "1": "capital",
        "2": "soccerplayer",
        "3": "country",
        "4": "film",
        "5": "genre",
        "6": "capital",
        "7": "author",
        "8": "largestCity",
        "9": "genre",
        "10": "animal",
    };
    return variableNames[questionId] || "Unknown";
}
