
Parser class :
    * constructor (parse)
        - contruit l'objet Parser.
        - this.parse = parse
        - *parse* est une fonction qui, a un stream, fait corespondre un parser 
        //- from a  `parse()` function
        //- the `parse()` function will determine the behaviour of the Parser
    * flatmap (f ): 
        - difficulty=2
        - parameter f is a function
        - pass parser.value to `f` function (TODO : better explain)
        - f can combine parsers to continue to read the stream, knowing the previous value
    

Parse() :  