import pandas
import matplotlib.pyplot as  plt

df=pandas.read_table("log.txt",sep=",",header=None)

lose_2=df[df[4]==2]
lose_1=df[df[4]==1]

print (lose_1)
print (lose_2)

plt.scatter(lose_2[0],lose_2[2], color="blue", s=3)
plt.scatter(lose_1[0],lose_1[2], color="red", s=3)
print ("Red:  1lose 2win")
print ("Blue: 1win  2lose")
print ("x: totaltime of 1")
print ("y: totaltime of 2")
plt.show()


plt.scatter(lose_2[1],lose_2[3], color="green", s=3)
plt.scatter(lose_1[1],lose_1[3], color="orange", s=3)
print ("Orange:  1lose 2win")
print ("Green: 1win  2lose")
print ("x: timeout of 1")
print ("y: timeout of 2")
plt.show()


