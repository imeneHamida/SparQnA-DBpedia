function submitQuestion() {
    var selectedQuestion = document.getElementById("questionSelect").value;
    var variableName = getVariableName(selectedQuestion);
    var sparqlQuery = constructSPARQLQuery(selectedQuestion, variableName);

    fetch('http://dbpedia.org/sparql?query=' + encodeURIComponent(sparqlQuery) + '&format=json')
        .then(response => response.json())
        .then(data => displayAnswer(data, variableName));
}

function constructSPARQLQuery(questionId, variableName) {
    // Define your SPARQL queries based on the selected questionId and variableName
    // Example: What is the capital of France?
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
            
            FILTER (?position = <http://dbpedia.org/resource/Forward_(association_football)>)
            FILTER (?birth = "1987-06-24"^^xsd:date)
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
    
    }
    // Add more queries as needed for other questions


function displayAnswer(data, variableName) {
    // Process the JSON response and display the answer
    var uri = data.results.bindings[0][variableName].value;
    var answer = uri.split('/').pop();

    document.getElementById("answer").innerHTML = "The Answer is:  " + answer;
}

function getVariableName(questionId) {
    // Map questionId to the corresponding variable name
    // You might want to make this mapping more sophisticated based on your specific needs
    const variableNames = {
        "1": "capital",
        "2": "soccerplayer",
        "3": "country",
        "4": "film",
        "5": "genre",
        // Add more mappings as needed
    };
    return variableNames[questionId] || "Unknown";
}
