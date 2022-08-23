import pandas
import matplotlib.pyplot as  plt

df=pandas.read_table("logold.txt",sep=",",header=None)

lose_2=df[df[2]==2]
lose_1=df[df[2]==1]

print (lose_1)
print (lose_2)

plt.scatter(lose_2[0],lose_2[1], color="blue", s=3)
plt.scatter(lose_1[0],lose_1[1], color="red", s=3)
print ("Red:  1lose 2win")
print ("Blue: 1win  2lose")
print ("x: iteration of 1")
print ("y: iteration of 2")
plt.show()


