#clean the data to make it more readable
#transforming the CSV
import csv
listOfCSVFiles = ['Production_Crops_E_Africa.csv','Production_Crops_E_Asia.csv', 'Production_Crops_E_Americas.csv', 'Production_Crops_E_Europe.csv', 'Production_Crops_E_Oceania.csv']
continents = ['Africa', 'Asia', 'Americas', 'Europe', 'Oceania']
NUMBER_OF_YEARS = 54

#first build up a dictionary - the key will be the country, the value will be a sub-dict in which the key is the product, 
#which has a value of a list. Each list element represents a year starting in 1961 and ending in 2014. Each year element is a list of [yearYield, yearTotalProduciton].
#yearYield is in hectograms/hectacre
#yearProduction is in total tons

#a dictionary to organize countries and continents
continentDict = {'Africa':[], 'Asia':[], 'Americas':[], 'Europe':[], 'Oceania':[]}

#a dictionary that will organize the yield and production data for each country over time
cropDict = {}
#{country: {product: [[yearYield1961, yearProduction1961], [yearYield1962, yearProduction1962], ...]}}

#rip through the CSV
for fileName in listOfCSVFiles:
	continent = continents[listOfCSVFiles.index(fileName)]
	file = '../agricultureData/original/' + fileName

	with open(file) as csvfile:
		csvReader = csv.reader(csvfile, delimiter=',')
		rowNumber = 0
		for row in csvReader:
			
			if rowNumber == 0: 
				#first row
				print("This is the first row")
			else:
				country = row[1]
				product = row[3]
				productionValue = row[5]


				#update the continent organization
				if country not in continentDict[continent]:
					continentDict[continent].append(country)

				if country not in cropDict:
					cropDict[country] = {}

				if product not in cropDict[country]:
					cropDict[country][product] = []

				for i in range(NUMBER_OF_YEARS):
					yearValue = row[7+2*i]
					if len(yearValue)==0:
						#no data exists, so they did not produce any product
						yearValue = 0

					if productionValue == "Yield":
						cropDict[country][product].append([yearValue])
					elif productionValue == "Production":
						if len(cropDict[country][product]) !=0: 
							#if this list does not exist it meanst there is no yield value
							#which means that the country has never produced this product
							cropDict[country][product][i].append(yearValue)
			rowNumber+=1

allProducts = []
for country in sorted(cropDict):
	for product in sorted(cropDict[country]):
		if product not in allProducts:
			allProducts.append(product)

for country in sorted(cropDict):
	for product in sorted(allProducts):
		if product not in cropDict[country] or cropDict[country][product] ==[]:
			#it means that this product was never produced so let's set it to zero every year
			cropDict[country][product] = []
			for year in xrange(NUMBER_OF_YEARS):
				cropDict[country][product].append([0,0])

#fix Russia and USSR
for product in cropDict["USSR"]:
	for year in xrange(31): # ussr went out of existence
		cropDict["Russian Federation"][product][year] = cropDict["USSR"][product][year]

#fix Sudan
for product in cropDict["Sudan (former)"]:
	for year in xrange(51): # former sudan went out of existence
		cropDict["Sudan"][product][year] = cropDict["Sudan (former)"][product][year]



#now write this information to a cleaner CSV
with open('../agricultureData/cleaned/TemporalFoodYieldByCountry.csv', 'w') as csvfile:
	csvWriter = csv.writer(csvfile)
	csvWriter.writerow(['continent','country','product',str("_1961"),str("_1962"),str("_1963"),str("_1964"),str("_1965"),str("_1966"),str("_1967"),str("_1968"),str("_1969"),str("_1970"),str("_1971"),str("_1972"),str("_1973"),str("_1974"),str("_1975"),str("_1976"),str("_1977"),str("_1978"),str("_1979"),str("_1980"),str("_1981"),str("_1982"),str("_1983"),str("_1984"),str("_1985"),str("_1986"),str("_1987"),str("_1988"),str("_1989"),str("_1990"),str("_1991"),str("_1992"),str("_1993"),str("_1994"),str("_1995"),str("_1996"),str("_1997"),str("_1998"),str("_1999"),str("_2000"),str("_2001"),str("_2002"),str("_2003"),str("_2004"),str("_2005"),str("_2006"),str("_2007"),str("_2008"),str("_2009"),str("_2010"),str("_2011"),str("_2012"),str("_2013"),str("_2014")])
	for continent in sorted(continentDict):
		for country in sorted(continentDict[continent]):
			for product in sorted(cropDict[country]):
				rowList = [continent,country,product]
				if cropDict[country][product] == []:
					for x in range(NUMBER_OF_YEARS):
						rowList.append(0)
				else:
					for year in cropDict[country][product]:
						rowList.append(year[0])
				csvWriter.writerow(rowList)


with open('../agricultureData/cleaned/TemporalFoodProductionByCountry.csv', 'w') as csvfile:
	csvWriter = csv.writer(csvfile)
	csvWriter.writerow(['continent','country','product',str("_1961"),str("_1962"),str("_1963"),str("_1964"),str("_1965"),str("_1966"),str("_1967"),str("_1968"),str("_1969"),str("_1970"),str("_1971"),str("_1972"),str("_1973"),str("_1974"),str("_1975"),str("_1976"),str("_1977"),str("_1978"),str("_1979"),str("_1980"),str("_1981"),str("_1982"),str("_1983"),str("_1984"),str("_1985"),str("_1986"),str("_1987"),str("_1988"),str("_1989"),str("_1990"),str("_1991"),str("_1992"),str("_1993"),str("_1994"),str("_1995"),str("_1996"),str("_1997"),str("_1998"),str("_1999"),str("_2000"),str("_2001"),str("_2002"),str("_2003"),str("_2004"),str("_2005"),str("_2006"),str("_2007"),str("_2008"),str("_2009"),str("_2010"),str("_2011"),str("_2012"),str("_2013"),str("_2014")])
	for continent in sorted(continentDict):
		for country in sorted(continentDict[continent]):
			for product in sorted(cropDict[country]):
				rowList = [continent,country,product]
				if cropDict[country][product] == []:
					for x in range(NUMBER_OF_YEARS):
						rowList.append(0)
				else:
					for year in cropDict[country][product]:
						try:
							rowList.append(year[1])
						except: 
							print(country)
							print(product)
							print(cropDict[country][product])
				csvWriter.writerow(rowList)


with open('../agricultureData/cleaned/TotalCountryProduction.csv', 'w') as csvfile:
	csvWriter = csv.writer(csvfile)
	csvWriter.writerow(['country',str("_1961"),str("_1962"),str("_1963"),str("_1964"),str("_1965"),str("_1966"),str("_1967"),str("_1968"),str("_1969"),str("_1970"),str("_1971"),str("_1972"),str("_1973"),str("_1974"),str("_1975"),str("_1976"),str("_1977"),str("_1978"),str("_1979"),str("_1980"),str("_1981"),str("_1982"),str("_1983"),str("_1984"),str("_1985"),str("_1986"),str("_1987"),str("_1988"),str("_1989"),str("_1990"),str("_1991"),str("_1992"),str("_1993"),str("_1994"),str("_1995"),str("_1996"),str("_1997"),str("_1998"),str("_1999"),str("_2000"),str("_2001"),str("_2002"),str("_2003"),str("_2004"),str("_2005"),str("_2006"),str("_2007"),str("_2008"),str("_2009"),str("_2010"),str("_2011"),str("_2012"),str("_2013"),str("_2014"),"total"])
	for country in sorted(cropDict):
		countryTotal = 0
		rowList = [country]
		for eachYear in xrange(NUMBER_OF_YEARS):
			countryYearTotal = 0
			for eachProduct in sorted(cropDict[country]):
				if cropDict[country][eachProduct] == []:
					countryYearTotal += 0
				else:
					countryYearTotal += int(float(cropDict[country][eachProduct][eachYear][1]))
			countryTotal += countryYearTotal
			rowList.append(countryYearTotal)
		rowList.append(countryTotal)
		csvWriter.writerow(rowList)

productYearDict = {}
with open('../agricultureData/cleaned/TotalProductionPerYearPerProduct.csv', 'w') as csvfile:
	csvWriter = csv.writer(csvfile)
	csvWriter.writerow(['product',str("_1961"),str("_1962"),str("_1963"),str("_1964"),str("_1965"),str("_1966"),str("_1967"),str("_1968"),str("_1969"),str("_1970"),str("_1971"),str("_1972"),str("_1973"),str("_1974"),str("_1975"),str("_1976"),str("_1977"),str("_1978"),str("_1979"),str("_1980"),str("_1981"),str("_1982"),str("_1983"),str("_1984"),str("_1985"),str("_1986"),str("_1987"),str("_1988"),str("_1989"),str("_1990"),str("_1991"),str("_1992"),str("_1993"),str("_1994"),str("_1995"),str("_1996"),str("_1997"),str("_1998"),str("_1999"),str("_2000"),str("_2001"),str("_2002"),str("_2003"),str("_2004"),str("_2005"),str("_2006"),str("_2007"),str("_2008"),str("_2009"),str("_2010"),str("_2011"),str("_2012"),str("_2013"),str("_2014"),"total"])


	for product in sorted(allProducts):
		productTotal = 0
		rowList = [product]
		productYearDict[product] = []
		for year in xrange(NUMBER_OF_YEARS):
			productYearTotal = 0
			for country in sorted(cropDict):
				if product in cropDict[country]:
					if cropDict[country][product] == []:
						productYearTotal += 0
					else:
						productYearTotal += int(float(cropDict[country][product][year][1]))
			productYearDict[product].append(productYearTotal)
			rowList.append(productYearTotal)
			productTotal += productYearTotal
		rowList.append(productTotal)
		csvWriter.writerow(rowList)

with open('../agricultureData/cleaned/CountryProductPercent.csv', 'w') as csvfile:
	csvWriter = csv.writer(csvfile)
	csvWriter.writerow(['country', 'product',str("_1961"),str("_1962"),str("_1963"),str("_1964"),str("_1965"),str("_1966"),str("_1967"),str("_1968"),str("_1969"),str("_1970"),str("_1971"),str("_1972"),str("_1973"),str("_1974"),str("_1975"),str("_1976"),str("_1977"),str("_1978"),str("_1979"),str("_1980"),str("_1981"),str("_1982"),str("_1983"),str("_1984"),str("_1985"),str("_1986"),str("_1987"),str("_1988"),str("_1989"),str("_1990"),str("_1991"),str("_1992"),str("_1993"),str("_1994"),str("_1995"),str("_1996"),str("_1997"),str("_1998"),str("_1999"),str("_2000"),str("_2001"),str("_2002"),str("_2003"),str("_2004"),str("_2005"),str("_2006"),str("_2007"),str("_2008"),str("_2009"),str("_2010"),str("_2011"),str("_2012"),str("_2013"),str("_2014")])
	for country in sorted(cropDict):
		countryTotal = 0
		# print(country)
		for product in sorted(allProducts):
			rowList = [country, product]
			# print("  "+product)
			for year in xrange(NUMBER_OF_YEARS):
				if productYearDict[product][year] == 0:
					percentOfTotal = 0
				else:
					percentOfTotal = round(float(cropDict[country][product][year][1])/float(productYearDict[product][year]),3)
					# if percentOfTotal < 0.001:
					# 	percentOfTotal = 0
					
				rowList.append(percentOfTotal)
			csvWriter.writerow(rowList)


with open('../agricultureData/cleaned/countryMax.csv', 'w') as csvfile:

	csvWriter = csv.writer(csvfile)
	csvWriter.writerow(['country', 'product', 'value'])
	for country in sorted(cropDict):
		maxVal = 0 
		maxProduct = 'None'
		for product in sorted(cropDict[country]):
			for year in cropDict[country][product]:
				if product == "Maize" and country == "India":
					print year
				if int(float(year[1]))>maxVal:
					maxVal = int(float(year[1]))
					maxProduct = product
		csvWriter.writerow([country,maxProduct,maxVal])





