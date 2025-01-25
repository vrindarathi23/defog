import textrazor

textrazor.api_key = "a619be13c0b5ae408788b20383e48333db966df44f00a006d70eaaa3"

client = textrazor.TextRazor(extractors=["entities", "topics"])

client.set_classifiers(["textrazor_mediatopics_2023Q1"])

response = client.analyze(
    "President Donald Trump fired the inspectors general from more than a dozen federal agencies in a Friday night purge, according to a Trump" + 
    "administration official, paving the way for him to install his own picks for the independent watchdog roles. Agency inspectors general" + 
    "received an email late Friday from Sergio Gor, the head of the White House Office of Presidential Personnel, informing them that “changing" + 
    "priorities” had led to their positions being “terminated” effective immediately, according to a person familiar with the matter. The shake-up" + 
    "affected a broad swath of the federal government, including the departments of State, Energy, the Interior, Defense and Transportation." + 
    "President Donald Trump is briefed on the effects of Hurricane Helene at Asheville Regional Airport in Fletcher, N.C., Friday, Jan. 24, 2025," + 
    "as first lady Melania Trump looks on. (AP Photo/Mark Schiefelbein) live updates Trump advances his agenda in opening days of presidency" + 
    "During Trump's first term, he gutted his administration of independent government watchdogs he saw as disloyal. An IG conducts investigations" + 
    "and audits into any potential malfeasance, fraud, waste or abuse by a government agency or its personnel, and issues reports and recommendations" + 
    "on its findings. An IG office is intended to operate independently. Partly in reaction to Trump's last IG firings, Congress built new guardrails" + 
    "intended to protect them. A 2023 law requires the White House to provide substantive rationale for terminating any inspector general." + 
    "The firings have prompted concern from some GOP senators, including Senate Judiciary Chairman Chuck Grassley of Iowa, a known “watchdog”" + 
    "for IGs, who said Congress wasn't given the 30 days' notice from the White House required by federal law. CNN has reached out to the White House for comment." +
    "The Washington Post was first to report on the firings. Republican senators, including Majority Leader John Thune of South Dakota, said they were not" + 
    "given any heads-up or explanation for the White House's decision."
)

entities = list(response.entities())
entities.sort(key=lambda x: x.relevance_score, reverse=True)
seen = set()

# for entity in entities:
#     if entity.id not in seen:
#         print(entity.id, entity.relevance_score, entity.confidence_score, entity.freebase_types)
#         seen.add(entity.id)

# for topic in response.topics():
#  	if topic.score > 0.3:
#  		print(topic.label)

# for category in response.categories():
# 	print(category.category_id, category.label, category.score)

             

