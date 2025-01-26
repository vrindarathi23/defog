import textrazor

textrazor.api_key = "a619be13c0b5ae408788b20383e48333db966df44f00a006d70eaaa3"

# we will want to extract main topics & entities
client = textrazor.TextRazor(extractors=["entities", "topics"])

# categories for news/media topics by 
client.set_classifiers(["textrazor_mediatopics_2023Q1"])

# get transcription as a string
content = ''
with open('transcribed_videos/test.txt') as file:
    content = file.read()

response = client.analyze(content)

# sort entities by relevance scores
entities = list(response.entities())
entities.sort(key=lambda x: x.relevance_score, reverse=True)
seen = set()

# writes top 10 entities in order of relevance scores
with open("main_topics.txt", "a") as file:
    i = 0
    while i < len(entities) or i < 11:
        if i >= len(entities):
            break
        if entities[i].id not in seen:
            file.write(entities[i].id + " ")
            seen.add(entities[i].id)
        i += 1

             

